/**
 * Action to save new front to RDB.
 *
 * @namespace TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_A_SaveFront
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_A_SaveFront';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Web_Event_Back_Mod_Server_Key} */
    const modKeys = spec['TeqFw_Web_Event_Back_Mod_Server_Key$'];
    /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
    const modBackUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
    /** @type {TeqFw_Web_Event_Shared_Dto_Register_Response} */
    const dtoRes = spec['TeqFw_Web_Event_Shared_Dto_Register_Response$'];
    /** @type {TeqFw_Web_Event_Back_Act_Front_Create.act|function} */
    const actCreate = spec['TeqFw_Web_Event_Back_Act_Front_Create$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS

    /**
     * Result function.
     * @param {TeqFw_Web_Event_Shared_Dto_Register_Request.Dto} req
     * @memberOf TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_A_SaveFront
     */
    async function act(req) {
        const trx = await conn.startTransaction();
        try {
            let res;
            const {id} = await actCreate({trx, keyPub: req.publicKey, uuid: req.frontUuid});
            await trx.commit();
            if (id) {
                res = dtoRes.createDto();
                res.frontBid = id;
                res.backKeyPublic = modKeys.getPublic();
                res.backUuid = modBackUuid.get();
                logger.info(`New frontend '${req.frontUuid}' is saved to RDB.`);
            } else {
                logger.error(`Cannot register frontend with uuid '${req.frontUuid}'. `
                    + `There is some other frontend with the same UUID and different public key.`);
            }
            return res;
        } catch (e) {
            console.log(e);
            await trx.rollback();
            throw e;
        }
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
