/**
 * Transborder events port to departure events messages from back to front.
 * @implements TeqFw_Web_Event_Shared_Api_Event_Portal
 */
export default class TeqFw_Web_Event_Back_Mod_Portal_Front {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Web_Event_Back_Mod_Registry_Stream} registry
     * @param {TeqFw_Web_Event_Shared_Dto_Event} factEvt
     * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response} factMeta
     * @param {TeqFw_Web_Event_Back_Mod_Queue} modQueue
     * @param {TeqFw_Core_Back_Mod_App_Uuid} modBackUuid
     * @param {TeqFw_Web_Event_Shared_Mod_Stamper} modStamper
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            TeqFw_Web_Event_Back_Mod_Registry_Stream$: registry,
            TeqFw_Web_Event_Shared_Dto_Event$: factEvt,
            TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response$: factMeta,
            TeqFw_Web_Event_Back_Mod_Queue$: modQueue,
            TeqFw_Core_Back_Mod_App_Uuid$: modBackUuid,
            TeqFw_Web_Event_Shared_Mod_Stamper$: modStamper,
        }) {
        // INSTANCE METHODS

        this.cleanDelayedEvents = async function () {
            return await modQueue.cleanUpExpired();
        };

        /**
         * @param {*} [data]
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response.Dto} [metaIn]
         * @returns {{data: *, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response.Dto}}
         */
        this.createMessage = function ({data: data, meta: metaIn} = {}) {
            const meta = factMeta.createDto(metaIn);
            return factEvt.createDto({data, meta: meta});
        }

        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
         * @return {Promise<string>} UUID of the event
         */
        this.publish = async function (message) {

            // FUNCS
            /**
             * Save event message to queue if message cannot be sent.
             * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} msg
             * @returns {Promise<void>}
             */
            async function saveToQueue(msg) {
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = msg.meta;
                if ((meta?.expired instanceof Date) && (meta.expired > new Date())) {
                    logger.info(`Event ${meta.name} (${meta.uuid}) cannot be published on offline front #${meta.frontUuid}. `);
                    await modQueue.save(msg);
                }
            }

            /**
             * Send event message to front using existing SSE stream.
             * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} msg
             * @param {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto} stream
             * @returns {Promise<boolean>}
             */
            async function sendToStream(msg, stream) {
                let res = false;
                const data = msg.data;
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = msg.meta;
                meta.frontUuid = stream.frontUuid;
                meta.sessionUuid = stream.sessionUuid;
                // encrypt or sign
                const scrambler = stream.scrambler;
                if (meta.encrypted === true)
                    msg.data = scrambler.encryptAndSign(JSON.stringify(data));
                else
                    meta.stamp = modStamper.create(meta, scrambler);
                // send or save
                if (stream.write(msg)) {
                    res = true;
                    logger.info(`${meta.name} (${meta.uuid}): ${meta.backUuid} => ${stream.frontUuid}/${stream.sessionUuid}`);
                } else await saveToQueue(msg);
                return res;
            }

            // MAIN
            let res;
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
            const meta = message.meta;
            if (!meta.name) meta.name = message.data.constructor.namespace;
            meta.backUuid = modBackUuid.get();
            // define type of message: to session or to front?
            if (meta.sessionUuid) {
                // send event to tab in browser
                const stream = registry.getBySessionUuid(meta.sessionUuid);
                if (stream) {
                    if (await sendToStream(message, stream)) {
                        res = message.meta.uuid;
                    }
                } else await saveToQueue(message);
            } else {
                // send this message to all sessions of the front
                const streams = registry.getByFrontUuid(meta.frontUuid);
                if (streams.length) {
                    const all = [];
                    for (const stream of streams)
                        all.push(sendToStream(message, stream));
                    await Promise.all(all);
                    res = message.meta.uuid;
                } else await saveToQueue(message);
            }
            return res;
        }

        this.sendDelayedEvents = async function ({uuid} = {}) {
            let count = 0;
            const streams = registry.getByFrontUuid(uuid);
            const sessions = streams.map((one) => one.sessionUuid);
            /** @type {TeqFw_Web_Event_Back_RDb_Schema_Queue.Dto[]} */
            const found = await modQueue.getEventsByFrontUuid(uuid);
            const now = new Date();
            for (const one of found) {
                count++;
                const eventId = one.id;
                logger.info(`Process delayed event #${eventId}.`);
                const data = JSON.parse(one.message);
                const event = factEvt.createDto(data);
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = event.meta;
                const dateEvent = castDate(meta.expired);
                if (dateEvent < now)
                    await modQueue.removeEvent(eventId); // just remove expired events
                else { // ... and process not expired
                    // send to session or to front
                    if (sessions.includes(meta.sessionUuid)) {
                        // send event to session
                        const stream = registry.getBySessionUuid(meta.sessionUuid);
                        if (typeof stream.write === 'function') {
                            // encrypt or sign
                            const scrambler = stream.scrambler;
                            if (meta.encrypted === true) {
                                event.data = scrambler.encryptAndSign(JSON.stringify(event.data));
                            } else {
                                meta.stamp = modStamper.create(meta, scrambler);
                            }
                            // write to stream
                            stream.write(event);
                            logger.info(`[delayed] ${meta.name} (${meta.uuid}): ${meta.backUuid} => ${meta.frontUuid}/${meta.sessionUuid}`);
                            await modQueue.removeEvent(eventId);
                        }
                    } else {
                        // send event to all streams (sessions)
                        for (const stream of streams) {
                            if (typeof stream.write === 'function') {
                                // encrypt or sign
                                const scrambler = stream.scrambler;
                                meta.sessionUuid = stream.sessionUuid;
                                if (meta.encrypted === true) {
                                    event.data = scrambler.encryptAndSign(JSON.stringify(event.data));
                                } else {
                                    meta.stamp = modStamper.create(meta, scrambler);
                                }
                                // write to stream
                                stream.write(event);
                                logger.info(`[delayed] ${meta.name} (${meta.uuid}): ${meta.backUuid} => ${meta.frontUuid}/${meta.sessionUuid}`);
                            }
                        }
                        await modQueue.removeEvent(eventId);
                    }
                }
            }
        }
    }
}
