/**
 * Get front UUID by front id from RDB.
 *
 * @namespace TeqFw_Web_Event_Back_Act_Front_GetUuidById
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Act_Front_GetUuidById';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
 * @param {TeqFw_Web_Event_Back_RDb_Schema_Front} rdbFront
 */
export default function (
    {
        TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
        TeqFw_Web_Event_Back_RDb_Schema_Front$: rdbFront,
    }) {
    // VARS
    /** @type {typeof TeqFw_Web_Event_Back_RDb_Schema_Front.ATTR} */
    const ATTR = rdbFront.getAttributes();

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} id front's ID
     * @return {Promise<{uuid: string}>}
     * @memberOf TeqFw_Web_Event_Back_Act_Front_GetUuidById
     */
    async function act({trx, id}) {
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto} */
        const one = await crud.readOne(trx, rdbFront, {[ATTR.BID]: id});
        const uuid = one?.uuid;
        return {uuid};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
