/**
 * Web server handler to activate established SSE connection with front.
 * Front sends decrypted streamUuid back to server.
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
export default class TeqFw_Web_Event_Back_Web_Handler_Stream_Activate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Event_Back_RDb_Schema_Front$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated} */
        const ebAuth = spec['TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Registry_Stream} */
        const modReg = spec['TeqFw_Web_Event_Back_Mod_Registry_Stream$'];
        /** @type {typeof TeqFw_Web_Event_Back_Enum_Stream_State} */
        const STATE = spec['TeqFw_Web_Event_Back_Enum_Stream_State$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Activate
         */
        async function process(req, res) {
            // FUNCS

            /**
             * Update authenticated data in RDB.
             * @param {number} bid backend ID for updated frontend
             * @returns {Promise<void>}
             */
            async function updateFrontAuthDate(bid) {
                const trx = await conn.startTransaction();
                try {
                    const dto = rdbFront.createDto();
                    dto.bid = bid;
                    dto.date_authenticated = new Date();
                    await crud.updateOne(trx, rdbFront, dto);
                    await trx.commit();
                } catch (e) {
                    logger.error(`Cannot set authenticated date for front #${bid}. Error: ${e?.message}`);
                    await trx.rollback();
                }
            }

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.MOD_WEB.SHARE_RES_STATUS)) {
                /** @type {TeqFw_Web_Event_Shared_Dto_Stream_Act.Dto} */
                const dataIn = shares.get(DEF.MOD_WEB.SHARE_REQ_BODY_JSON);
                const frontUuid = dataIn.frontUuid;
                const streamUuid = dataIn.streamUuid;
                const found = modReg.get(streamUuid);
                if (found && (found.frontUuid === frontUuid)) {
                    found.state = STATE.ACTIVE;
                    clearTimeout(found.unauthenticatedCloseId);
                    shares.set(DEF.MOD_WEB.SHARE_RES_BODY, JSON.stringify(true));
                    logger.info(`Stream '${streamUuid}' is activated (front: ${frontUuid}/${found.sessionUuid}).`);
                    // update front data in RDB
                    updateFrontAuthDate(found.frontBid).then();
                    // produce local event
                    const data = ebAuth.createDto();
                    data.frontBid = found.frontBid;
                    data.frontUuid = found.frontUuid;
                    data.sessionUuid = found.sessionUuid;
                    data.streamUuid = found.uuid;
                    const msg = eventsBack.createMessage({data});
                    eventsBack.publish(msg).then();
                } else {
                    logger.error(`Stream '${streamUuid}' is not found or is not corresponded to front '${frontUuid}'.`);
                }
            }
        }

        Object.defineProperty(process, 'namespace', {value: this.constructor.name});

        // INSTANCE METHODS

        // noinspection JSUnusedGlobalSymbols
        this.getProcessor = () => process;

        this.init = async function () {
            const space = DEF.SHARED.SPACE_STREAM_ACTIVATE;
            logger.info(`Initialize web requests handler to activate SSE streams (space: '${space}').`);
        }

        // noinspection JSUnusedGlobalSymbols
        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_STREAM_ACTIVATE)
            );
        }

    }
}
