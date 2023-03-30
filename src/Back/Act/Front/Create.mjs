/**
 * Register new front in RDB.
 *
 * @namespace TeqFw_Web_Event_Back_Act_Front_Create
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Act_Front_Create';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front} */
    const rdbFront = spec['TeqFw_Web_Event_Back_RDb_Schema_Front$'];

    // VARS
    logger.setNamespace(NS);
    /** @type {typeof TeqFw_Web_Event_Back_RDb_Schema_Front.ATTR} */
    const ATTR = rdbFront.getAttributes();

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} keyPub asymmetric public key for the front
     * @param {string} uuid front's UUID
     * @return {Promise<{id: number}>}
     * @memberOf TeqFw_Web_Event_Back_Act_Front_Create
     */
    async function act({trx, keyPub, uuid}) {
        const res = {};
        // lookup for existing front
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto} */
        const found = await crud.readOne(trx, rdbFront, {[ATTR.UUID]: uuid});
        if (!found) {
            const data = {
                [ATTR.DATE_CREATED]: new Date(),
                [ATTR.KEY_PUB]: keyPub,
                [ATTR.UUID]: uuid,
            };
            const pk = await crud.create(trx, rdbFront, data);
            res.id = pk[ATTR.BID];
        } else if (found.key_pub === keyPub) {
            res.id = found.bid;
        } else {
            // I don't know what we should to do here :(
        }
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
