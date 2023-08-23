/**
 * Delayed events queue.
 *
 * @namespace TeqFw_Web_Event_Back_Mod_Queue
 */
export default class TeqFw_Web_Event_Back_Mod_Queue {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_Util.dateUtc|function} dateUtc
     * @param {TeqFw_Db_Back_RDb_IConnect} rdb
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {TeqFw_Web_Event_Back_RDb_Schema_Queue} rdbQueue
     * @param {TeqFw_Web_Event_Back_Act_Front_GetIdByUuid.act|function} actGetIdByUuid
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Db_Back_Util.dateUtc': dateUtc,
            TeqFw_Db_Back_RDb_IConnect$: rdb,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            TeqFw_Web_Event_Back_RDb_Schema_Queue$: rdbQueue,
            TeqFw_Web_Event_Back_Act_Front_GetIdByUuid$: actGetIdByUuid,
        }) {
        // VARS
        /** @type {typeof TeqFw_Web_Event_Back_RDb_Schema_Queue.ATTR} */
        const A_QUEUE = rdbQueue.getAttributes();

        // MAIN
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.cleanUpExpired = async function () {
            const trx = await rdb.startTransaction();
            try {
                const where = (builder) => builder.where(A_QUEUE.DATE_EXPIRED, '<=', dateUtc(new Date()));
                const res = await crud.deleteSet(trx, rdbQueue, where);
                await trx.commit();
                return res;
            } catch (e) {
                await trx.rollback();
            }
            return 0;
        }

        /**
         * Save event to RDB.
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} event
         * @return {Promise<void>}
         */
        this.save = async function (event) {
            const trx = await rdb.startTransaction();
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
            const meta = event.meta;
            // const logMeta = dtoLogMeta.createDto();
            // logMeta.backUuid = modBackUuid.get();
            // logMeta.eventName = meta.name;
            // logMeta.eventUuid = meta.uuid;
            // logMeta.streamUuid = meta.streamUuid;
            try {
                const {id: frontId} = await actGetIdByUuid({trx, uuid: meta.frontUuid});
                const dto = rdbQueue.createDto();
                dto.date_expired = meta.expired;
                dto.front_ref = frontId;
                dto.message = JSON.stringify(event);
                const pk = await crud.create(trx, rdbQueue, dto);
                logger.info(`Event message #${meta.uuid} is saved to backend queue as #${pk[A_QUEUE.ID]}.`);
                await trx.commit();
            } catch (e) {
                await trx.rollback();
                logger.error(`Cannot save event #${meta?.uuid} to queue. Error: ${e.message}`);
            }
        }

        /**
         * Get all delayed events by front UUID.
         * @param {string} uuid
         * @return {Promise<TeqFw_Web_Event_Back_RDb_Schema_Queue.Dto[]>}
         */
        this.getEventsByFrontUuid = async function (uuid) {
            const res = [];
            const trx = await rdb.startTransaction();
            try {
                const {id} = await actGetIdByUuid({trx, uuid});
                const where = {[A_QUEUE.FRONT_REF]: id};
                /** @type {TeqFw_Web_Event_Back_RDb_Schema_Queue.Dto[]} */
                const items = await crud.readSet(trx, rdbQueue, where);
                await trx.commit();
                res.push(...items);
            } catch (e) {
                await trx.rollback();
            }
            return res;
        }

        /**
         * Remove one delayed event by event ID.
         * @param {number} id
         * @return {Promise<boolean>}
         */
        this.removeEvent = async function (id) {
            let res = false;
            const trx = await rdb.startTransaction();
            try {
                const where = {[A_QUEUE.ID]: id};
                const rs = await crud.deleteOne(trx, rdbQueue, where);
                res = (rs === 1);
                await trx.commit();
                logger.info(`Delayed event #${id} is removed from queue.`);
            } catch (e) {
                logger.error(`Cannot remove delayed event #${id}. Error: ${e.message}`);
                await trx.rollback();
            }
            return res;
        }

    }
}
