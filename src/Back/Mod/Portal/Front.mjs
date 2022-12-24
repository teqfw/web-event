/**
 * Transborder events port to departure events messages from back to front.
 * @implements TeqFw_Web_Event_Shared_Api_Event_Portal
 */
export default class TeqFw_Web_Event_Back_Mod_Portal_Front {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Registry_Stream} */
        const registry = spec['TeqFw_Web_Event_Back_Mod_Registry_Stream$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Crypto_Scrambler.Factory} */
        const factScrambler = spec['TeqFw_Web_Event_Shared_Api_Crypto_Scrambler.Factory$']; // interface
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const factEvt = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans} */
        const factMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Queue} */
        const modQueue = spec['TeqFw_Web_Event_Back_Mod_Queue$'];
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const modBackUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Key} */
        const modServerKey = spec['TeqFw_Web_Event_Back_Mod_Server_Key$'];
        /** @type {TeqFw_Web_Event_Shared_Mod_Stamper} */
        const modStamper = spec['TeqFw_Web_Event_Shared_Mod_Stamper$'];
        /** @type {TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed} */
        const ebRepublishDelayed = spec['TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const _keyPub = modServerKey.getPublic();
        const _keySec = modServerKey.getSecret();


        // INSTANCE METHODS
        /**
         * Create empty message for 'back-to-front' transborder event.
         * @returns {TeqFw_Web_Event_Shared_Dto_Event.Dto}
         */
        this.createMessage = function ({data, meta} = {}) {
            const metaTrans = factMeta.createDto(meta);
            return factEvt.createDto({data, meta: metaTrans});
        }

        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
         * @return {Promise<void>} return nothing or add comment if refactored
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
                if (meta?.expired) {
                    logger.info(`Event ${meta.name} (${meta.uuid}) cannot be published on offline front #${meta.frontUuid}. `);
                    await modQueue.save(msg);
                }
            }

            /**
             * Send event message to front using existing SSE stream.
             * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} msg
             * @param {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto} stream
             * @returns {Promise<void>}
             */
            async function sendToStream(msg, stream) {
                const data = msg.data;
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = msg.meta;

                // encrypt or sign
                if (meta.encrypted === true) {
                    const scrambler = await factScrambler.create();
                    scrambler.setKeys(stream.frontKeyPub, _keySec);
                    msg.data = scrambler.encryptAndSign(JSON.stringify(data));
                } else {
                    modStamper.initKeys(stream.frontKeyPub, _keySec);
                    meta.stamp = modStamper.create(meta);
                }
                if (stream.write(msg)) {
                    logger.info(`${meta.name} (${meta.uuid}): ${meta.backUuid} => ${stream.frontUuid}/${stream.sessionUuid}`);
                } else await saveToQueue(msg);
            }

            // MAIN
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
            const meta = message.meta;
            if (!meta.name) meta.name = message.data.constructor.namespace;
            meta.backUuid = modBackUuid.get();
            // define type of message: to session or to front?
            if (meta.sessionUuid) {
                // send event to tab in browser
                const stream = registry.getBySessionUuid(meta.sessionUuid);
                if (stream) await sendToStream(message, stream);
                else await saveToQueue(message);
            } else {
                // send this message to all sessions of the front
                const streams = registry.getByFrontUuid(meta.frontUuid);
                if (streams.length) {
                    const all = [];
                    for (const stream of streams)
                        all.push(sendToStream(message, stream));
                    await Promise.all(all);
                } else await saveToQueue(message);
            }
        }

        /**
         * Re-publish delayed events for given front.
         * @param {number} frontId front app ID in back RDB
         * @param {string} frontUuid
         * @return {Promise<void>}
         */
        this.sendDelayedEvents = async function (frontId, frontUuid) {
            let count = 0;
            /** @type {TeqFw_Web_Event_Back_RDb_Schema_Queue.Dto[]} */
            const found = await modQueue.getEventsByFrontUuid(frontUuid);
            const now = new Date();
            for (const one of found) {
                count++;
                const eventId = one.id;
                logger.info(`Process delayed event #${eventId}.`);
                const data = JSON.parse(one.message);
                const event = factEvt.createDto(data);
                const meta = event.meta;
                const dateEvent = castDate(meta.expiration);
                if (dateEvent < now)
                    await modQueue.removeEvent(eventId); // just remove expired events
                else { // ... and process not expired
                    const conn = registry.getByFrontUuid(frontUuid);
                    if (conn) {
                        conn.write(event);
                        logger.info(`<= ${frontUuid} / ${meta.uuid}: ${meta.name}`);
                        await modQueue.removeEvent(eventId);
                    } else {
                        // connection is closed, break the loop
                        break;
                    }
                }
            }
            if (count > 0) {
                logger.info(`Total ${count} delayed events were processed for front #${frontUuid}.`, {frontUuid});
                const data = ebRepublishDelayed.createDto();
                data.count = count;
                data.frontId = frontId;
                data.frontUuid = frontUuid;
                const msg = eventsBack.createMessage();
                msg.data = data;
                eventsBack.publish(msg).then();
            }
        }
    }
}
