/**
 * Read front data by front UUID from RDB.
 *
 * @namespace TeqFw_Web_Event_Back_Act_Front_ReadByUuid
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Act_Front_ReadByUuid';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front} */
    const rdbFront = spec['TeqFw_Web_Event_Back_RDb_Schema_Front$'];

    // VARS
    /** @type {typeof TeqFw_Web_Event_Back_RDb_Schema_Front.ATTR} */
    const ATTR = rdbFront.getAttributes();

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} uuid front's UUID
     * @return {Promise<TeqFw_Web_Event_Back_RDb_Schema_Front.Dto>}
     * @memberOf TeqFw_Web_Event_Back_Act_Front_ReadByUuid
     */
    async function act({trx, uuid}) {
        return await crud.readOne(trx, rdbFront, {[ATTR.UUID]: uuid});
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
