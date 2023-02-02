/**
 * Transborder events portal to departure events messages from front to back.
 *
 * @implements TeqFw_Web_Event_Shared_Api_Event_Portal
 */
export default class TeqFw_Web_Event_Front_Mod_Portal_Back {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Event_Front_Web_Connect_Direct} */
        const conn = spec['TeqFw_Web_Event_Front_Web_Connect_Direct$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Identity_Front} */
        const modIdFront = spec['TeqFw_Web_Event_Front_Mod_Identity_Front$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Identity_Session} */
        const modIdSession = spec['TeqFw_Web_Event_Front_Mod_Identity_Session$'];
        /** @type {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} */
        const modConn = spec['TeqFw_Web_Front_Api_Mod_Server_Connect_IState$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['TeqFw_Web_Event_Front_IDb$']; // plugin's local IDB
        /** @type {TeqFw_Web_Event_Front_IDb_Schema_Queue} */
        const idbQueue = spec['TeqFw_Web_Event_Front_IDb_Schema_Queue$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const factEvt = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans} */
        const factMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans$'];

        // VARS
        const I_QUEUE = idbQueue.getIndexes();

        // MAIN
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS
        this.createMessage = function ({data, meta} = {}) {
            const metaTrans = factMeta.createDto(meta);
            return factEvt.createDto({data, meta: metaTrans});
        }

        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
         * @return {Promise<string>} UUID of the event
         */
        this.publish = async function (message) {
            // FUNCS

            /**
             * Save event message to queue if not sent.
             * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
             * @returns {Promise<void>}
             */
            async function saveToQueue(message) {
                // FUNCS

                /**
                 * Queue event message before sending to back.
                 * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} event
                 * @return {Promise<string>}
                 */
                async function saveToIdb(event) {
                    const trx = await idb.startTransaction([idbQueue]);
                    // noinspection JSCheckFunctionSignatures
                    const dto = idbQueue.createDto(event);
                    const id = await idb.create(trx, idbQueue, dto);
                    trx.commit();
                    return id;
                }

                // MAIN
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = message.meta;
                logger.info(`Event ${meta.name} (${meta.uuid}) cannot be published on the back #${meta.backUuid}. `);
                await saveToIdb(message);
            }

            // MAIN
            let res;
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
            const meta = message.meta;
            if (!meta.name) meta.name = message.data.constructor.namespace;
            meta.frontUuid = modIdFront.getFrontUuid();
            // we have one only back for the moment
            meta.backUuid = modIdSession.getBackUuid();
            meta.sessionUuid = modIdSession.getSessionUuid();
            if (modConn.isOnline()) {
                const sent = await conn.send(message);
                if (sent) res = meta.uuid
                else await saveToQueue(message);
            } else await saveToQueue(message);
            return res;
        }

        this.cleanDelayedEvents = async function () {
            let res = 0;
            const now = new Date();
            const trx = await idb.startTransaction([idbQueue]);
            const events = await idb.readSet(trx, idbQueue, I_QUEUE.BY_DATE);
            for (const event of events) {
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = event.meta;
                if ((meta.expired === undefined) || (castDate(meta.expired) < now)) {
                    await idb.deleteOne(trx, idbQueue, event.meta.uuid);
                    res++;
                }
            }
            trx.commit();
            return res;
        }

        this.sendDelayedEvents = async function ({uuid} = {}) {
            // FUNCS

            /**
             * Remove sent event from the queue.
             * @param {string} uuid
             * @return {Promise<void>}
             */
            async function removeFromQueue(uuid) {
                const trx = await idb.startTransaction([idbQueue]);
                const res = await idb.deleteOne(trx, idbQueue, uuid);
                trx.commit();
                return res;
            }

            /**
             * @return {Promise<TeqFw_Web_Event_Shared_Dto_Event.Dto[]>}
             */
            async function getDelayedEvents() {
                const trx = await idb.startTransaction([idbQueue]);
                const res = await idb.readSet(trx, idbQueue, I_QUEUE.BY_DATE);
                trx.commit();
                return res;
            }

            // MAIN
            const now = new Date();
            await this.cleanDelayedEvents();
            const events = await getDelayedEvents();
            // re-assign sink & stream (we have one only back for the moment)
            const backUuid = modIdSession.getBackUuid();
            const sessionUuid = modIdSession.getSessionUuid();
            for (const event of events) {
                // TODO: don't send expired events
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = event.meta;
                meta.backUuid = backUuid;
                meta.sessionUuid = sessionUuid;
                const sent = await conn.send(event);
                if (sent) await removeFromQueue(meta.uuid);
            }
        }
    }
}
