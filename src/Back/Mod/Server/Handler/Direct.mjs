/**
 * Web server handler to receive 'front-to-back' events (direct stream).
 * Handler verifies stamps of the event messages and publishes their to backend event bus.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Mod_Server_Handler_Direct';
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
export default class TeqFw_Web_Event_Back_Mod_Server_Handler_Direct {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond403|function} */
        const respond403 = spec['TeqFw_Web_Back_App_Server_Respond.respond403'];
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond500|function} */
        const respond500 = spec['TeqFw_Web_Back_App_Server_Respond.respond500'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventBus = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoEvent = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Response} */
        const dtoRes = spec['TeqFw_Web_Event_Shared_Dto_Event_Response$'];
        /** @type {TeqFw_Web_Event_Back_Fact_Stamper} */
        const factStamper = spec['TeqFw_Web_Event_Back_Fact_Stamper$'];
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const modBackUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Shared_Dto_Log_Meta_Event} */
        const dtoLogMeta = spec['TeqFw_Web_Shared_Dto_Log_Meta_Event$'];

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Mod_Server_Handler_Direct
         */
        async function process(req, res) {
            // FUNCS
            /**
             * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
             */
            function logEvent(meta) {
                const logMeta = dtoLogMeta.createDto();
                logMeta.backUuid = modBackUuid.get();
                logMeta.eventName = meta.name;
                logMeta.eventUuid = meta.uuid;
                logMeta.frontUuid = meta.frontUUID;
                logger.info(`${meta.frontUUID} => ${meta.name} (${meta.uuid}).`, logMeta);
            }

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.MOD_WEB.SHARE_RES_STATUS)) {
                let frontUuid, eventUuid;
                const json = shares.get(DEF.MOD_WEB.SHARE_REQ_BODY_JSON);
                try {
                    const message = dtoEvent.createDto(json);
                    const meta = message.meta;
                    frontUuid = meta.frontUUID;
                    eventUuid = meta.uuid;
                    // try to load public key using front UUID then validate encryption stamp
                    const stamper = await factStamper.create({frontUuid});
                    if (stamper) {
                        const valid = stamper.verify(message.stamp, meta);
                        if (valid) {
                            // stamp is valid, log event then publish it to backend event bus
                            logEvent(meta);
                            eventBus.publish(message);
                            // respond as succeed
                            res.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'application/json');
                            const eventRes = dtoRes.createDto();
                            eventRes.success = true;
                            shares.set(DEF.MOD_WEB.SHARE_RES_BODY, JSON.stringify(eventRes));
                            shares.set(DEF.MOD_WEB.SHARE_RES_STATUS, HTTP_STATUS_OK);
                        } else {
                            const msg = `Cannot verify encryption stamp.`;
                            logger.error(`Front authentication is failed. ${msg}`, meta);
                            respond403(res, msg);
                        }
                    } else {
                        const msg = `Unknown front UUID: ${frontUuid}`;
                        logger.error(`Front authentication is failed. ${msg}`, meta);
                        respond403(res, msg);
                    }
                } catch (e) {
                    logger.error(`Error for event #${frontUuid}/${eventUuid}: ${e?.message}`);
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
