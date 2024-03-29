/**
 * Web server handler to receive 'front-to-back' events (direct stream).
 * Handler verifies stamps of the event messages and publishes their to backend event bus.
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Web_Handler_Direct';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_POST,
    HTTP_STATUS_OK,
} = H2;


// MODULE'S CLASSES
// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Event_Back_Web_Handler_Direct {
    /**
     * @param {TeqFw_Web_Event_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Back_App_Server_Respond.respond403|function} respond403
     * @param {TeqFw_Web_Back_App_Server_Respond.respond500|function} respond500
     * @param {TeqFw_Web_Event_Back_Mod_Channel} eventsBack
     * @param {TeqFw_Web_Event_Shared_Dto_Event} dtoEvent
     * @param {TeqFw_Web_Event_Back_Mod_Registry_Stream} modRegStream
     * @param {TeqFw_Web_Event_Shared_Mod_Stamper} stamper
     */
    constructor(
        {
            TeqFw_Web_Event_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Web_Back_App_Server_Respond.respond403': respond403,
            'TeqFw_Web_Back_App_Server_Respond.respond500': respond500,
            TeqFw_Web_Event_Back_Mod_Channel$: eventsBack,
            TeqFw_Web_Event_Shared_Dto_Event$: dtoEvent,
            TeqFw_Web_Event_Back_Mod_Registry_Stream$: modRegStream,
            TeqFw_Web_Event_Shared_Mod_Stamper$: stamper,
        }) {
        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Direct
         */
        async function process(req, res) {
            // FUNCS
            /**
             * Log error and send HTTP status 403.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
             * @param {string} msg
             */
            function res403(res, msg) {
                logger.error(`Front authentication is failed. ${msg}`);
                respond403(res, msg);
            }

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                const json = shares[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                const message = dtoEvent.createDto(json);
                // noinspection JSValidateTypes
                /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                const meta = message.meta;
                const sessionUuid = meta?.sessionUuid;
                const eventUuid = meta?.uuid;
                try {
                    // try to load public key using front UUID then validate encryption stamp
                    const stream = modRegStream.getBySessionUuid(sessionUuid);
                    if (stream) {
                        const valid = stamper.verify(meta, stream.scrambler);
                        if (valid) {
                            // stamp is valid, log event then publish it to backend event bus
                            logger.info(`${meta.name} (${meta.uuid}): ${meta.backUuid} => ${meta.frontUuid}/${meta.sessionUuid}`);
                            eventsBack.publish(message).then();
                            // respond as succeed
                            res.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'application/json');
                            shares[DEF.MOD_WEB.SHARE_RES_BODY] = JSON.stringify(true);
                            shares[DEF.MOD_WEB.SHARE_RES_STATUS] = HTTP_STATUS_OK;
                        } else {
                            const msg = 'Cannot verify encryption stamp.';
                            logger.error(msg);
                            res403(res, msg);
                        }
                    } else {
                        const msg = `Unknown event session UUID: ${sessionUuid}. Perhaps SSE stream was closed.`;
                        logger.error(msg);
                        res403(res, msg);
                    }
                } catch (e) {
                    logger.error(`Error for event #${eventUuid} (sess: ${sessionUuid}): ${e?.message}`);
                    respond500(res, e?.message);
                }
            }
        }

        // INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`Initialize Direct Events Stream handler for web requests.`);
        }

        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_DIRECT)
            );
        }
    }
}
