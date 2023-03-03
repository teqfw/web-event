/**
 * Web server handler to activate established SSE connection with front when front sends decrypted streamUuid
 * back to server.
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
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Event_Back_RDb_Schema_Front$'];
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front_Session} */
        const rdbFrontSess = spec['TeqFw_Web_Event_Back_RDb_Schema_Front_Session$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Portal_Front} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Portal_Front$'];
        /** @type {TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated} */
        const ebAuth = spec['TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Registry_Stream} */
        const modReg = spec['TeqFw_Web_Event_Back_Mod_Registry_Stream$'];
        /** @type {typeof TeqFw_Web_Event_Back_Enum_Stream_State} */
        const STATE = spec['TeqFw_Web_Event_Back_Enum_Stream_State$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        const A_SESS = rdbFrontSess.getAttributes();

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
             * Update data in RDB: front authentication date and session data (uuid & connection date).
             * @param {number} frontBid backend ID for front
             * @param {string} sessUuid session UUID received from the front
             * @returns {Promise<void>}
             */
            async function updateRdb(frontBid, sessUuid) {
                const trx = await conn.startTransaction();
                try {
                    const now = new Date();
                    // update front's authentication date
                    const dtoFront = rdbFront.createDto();
                    dtoFront.bid = frontBid;
                    dtoFront.date_authenticated = now;
                    await crud.updateOne(trx, rdbFront, dtoFront);
                    // handle session data
                    const key = {[A_SESS.UUID]: sessUuid, [A_SESS.FRONT_REF]: frontBid};
                    /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front_Session.Dto} */
                    const found = await crud.readOne(trx, rdbFrontSess, key);
                    if (found) {
                        // update data for existing session
                        found.date_connected = now;
                        await crud.updateOne(trx, rdbFrontSess, found);
                        logger.info(`Update the last connected date for event session #${found.bid} (front #${frontBid}).`);
                    } else {
                        // register new session
                        const dtoSess = rdbFrontSess.createDto();
                        dtoSess.uuid = sessUuid;
                        dtoSess.date_created = now;
                        dtoSess.date_connected = now;
                        dtoSess.front_ref = frontBid;
                        const {[A_SESS.BID]: sessBid} = await crud.create(trx, rdbFrontSess, dtoSess);
                        logger.info(`New event session #${sessBid} is registered for front #${frontBid}.`);
                    }
                    await trx.commit();
                } catch (e) {
                    logger.error(`Cannot set authenticated date for front #${frontBid}. Error: ${e?.message}`);
                    await trx.rollback();
                }
            }

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                /** @type {TeqFw_Web_Event_Shared_Dto_Stream_Act.Dto} */
                const dataIn = shares[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                const frontUuid = dataIn.frontUuid;
                const streamUuid = dataIn.streamUuid;
                const found = modReg.get(streamUuid);
                if (found && (found.frontUuid === frontUuid)) {
                    const frontBid = found.frontBid;
                    const sessUuid = found.sessionUuid;
                    found.state = STATE.ACTIVE;
                    clearTimeout(found.unauthenticatedCloseId);
                    shares[DEF.MOD_WEB.SHARE_RES_BODY] = JSON.stringify(true);
                    logger.info(`Stream '${streamUuid}' is activated (front: ${frontUuid}/${sessUuid}).`);
                    // update front data in RDB
                    updateRdb(frontBid, sessUuid).then();
                    // send delayed events
                    await portalFront.sendDelayedEvents({uuid: found.frontUuid});
                    // produce local event
                    const data = ebAuth.createDto();
                    data.frontBid = frontBid;
                    data.frontUuid = frontUuid;
                    data.sessionUuid = sessUuid;
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
