/**
 * Web server handler to register new frontends and save its public key to RDB.
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const {
    HTTP2_METHOD_POST,
} = H2;

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Event_Back_Web_Handler_Front_Register {
    /**
     * @param {TeqFw_Web_Event_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Web_Event_Back_Act_Front_Create.act|function} actCreate
     */
    constructor(
        {
            TeqFw_Web_Event_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Web_Event_Back_Act_Front_Create$: actCreate,
        }) {
        // FUNCS

        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Front_Register
         */
        async function process(req, res) {
            // FUNCS
            /**
             * @param {string} uuid
             * @param {string} keyPub
             * @returns {Promise<number>} frontBid
             */
            async function saveFront(uuid, keyPub) {
                const trx = await conn.startTransaction();
                try {
                    const {id: res} = await actCreate({trx, uuid, keyPub});
                    await trx.commit();
                    if (res) logger.info(`New front '${uuid}' is saved to RDB as #${res}.`);
                    else logger.error(`Cannot register front with UUID '${uuid}'. `
                        + `There is some other frontend with the same UUID and different public key.`);
                    return res;
                } catch (e) {
                    logger.error(`Cannot register new front '${uuid}'. Error: ${e?.message}`);
                    await trx.rollback();
                }
            }

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                // register UUID & public key for a new front in RDB
                /** @type {TeqFw_Web_Event_Shared_Dto_Register_Request.Dto} */
                const dataIn = shares[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                const frontBid = await saveFront(dataIn.frontUuid, dataIn.publicKey);
                if (frontBid) shares[DEF.MOD_WEB.SHARE_RES_BODY] = JSON.stringify(frontBid);
            }
        }

        Object.defineProperty(process, 'namespace', {value: this.constructor.name});

        // INSTANCE METHODS

        // noinspection JSUnusedGlobalSymbols
        this.getProcessor = () => process;

        this.init = async function () {
            const space = DEF.SHARED.SPACE_FRONT_REG;
            logger.info(`Initialize frontends registration handler for web requests (space: '${space}').`);
        }

        // noinspection JSUnusedGlobalSymbols
        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_FRONT_REG)
            );
        }

    }
}
