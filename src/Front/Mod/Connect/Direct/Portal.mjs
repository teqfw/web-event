/**
 * Transborder events portal to departure events messages from front to back.
 *
 * @namespace TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal
 */
export default class TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Event_Front_Mod_Connect_Direct} */
        const conn = spec['TeqFw_Web_Event_Front_Mod_Connect_Direct$'];
        /** @type {TeqFw_Web_Api_Front_Mod_App_Front_Identity} */
        const frontIdentity = spec['TeqFw_Web_Api_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Api_Front_Mod_App_Back_Identity} */
        const backIdentity = spec['TeqFw_Web_Api_Front_Mod_App_Back_Identity$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['TeqFw_Web_Front_Store_Db$']; // plugin's local IDB
        /** @type {TeqFw_Web_Front_Store_Entity_Event_Delayed} */
        const idbQueue = spec['TeqFw_Web_Front_Store_Entity_Event_Delayed$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventBus = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticated} */
        const esbAuthenticated = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticated$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        // VARS
        const I_DELAYED = idbQueue.getIndexes();

        // MAIN
        eventBus.subscribe(esbAuthenticated.getEventName(), onReverseAuthenticated);
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * Queue event message before sending to back.
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} event
         * @return {Promise<string>}
         */
        async function saveToQueue(event) {
            const trx = await idb.startTransaction([idbQueue]);
            // noinspection JSCheckFunctionSignatures
            const dto = idbQueue.createDto(event);
            const id = await idb.create(trx, idbQueue, dto);
            trx.commit();
            return id;
        }

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

        async function onReverseAuthenticated() {
            // FUNCS
            /**
             * @return {Promise<TeqFw_Web_Event_Shared_Dto_Event.Dto[]>}
             */
            async function getDelayedEvents() {
                const trx = await idb.startTransaction([idbQueue]);
                const res = await idb.readSet(trx, idbQueue, I_DELAYED.BY_DATE);
                trx.commit();
                return res;
            }

            // MAIN
            const now = new Date();
            const events = await getDelayedEvents();
            for (const event of events) {
                const dateEvent = castDate(event.meta.expiration);
                if (dateEvent < now)
                    await removeFromQueue(event.meta.uuid); // just remove expired events
                else { // ... and process not expired
                    const sent = await conn.send(event);
                    if (sent) await removeFromQueue(event.meta.uuid);
                }
            }
        }

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto|*} event
         * @return {Promise<void>}
         */
        this.publish = async function (event) {
            const meta = event.meta;
            meta.backUUID = backIdentity.getUUID();
            meta.frontUUID = frontIdentity.getUuid();
            logger.info(`Save event #${meta.uuid} (${meta.name}) to front queue and publish it.`);
            await saveToQueue(event);
            const sent = await conn.send(event);
            if (sent) {
                await removeFromQueue(meta?.uuid);
                logger.info(`Event #${meta.uuid} (${meta.name}) is published to back and removed from front queue.`);
            } else {
                logger.info(`Event #${meta.uuid} (${meta.name}) is not published to back.`);
            }
        }
    }
}
