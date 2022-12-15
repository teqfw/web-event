/**
 * Web server handler to establish event stream from back to front (reverse channel).
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse';
const {
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
} = H2;

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const modAppUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond400|function} */
        const respond400 = spec['TeqFw_Web_Back_App_Server_Respond.respond400'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_A_SaveFront.act|function} */
        const aSaveFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_A_SaveFront$'];
        /** @type {TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act|function} */
        const aOpenStream = spec['TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream$'];

        // VARS
        /**
         * UUID for this backup instance.
         * @type {string}
         */
        const _backUuid = modAppUuid.get();

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
        logger.setNamespace(this.constructor.name);

        // FUNCS

        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse
         */
        async function process(req, res) {
            // FUNCS
            /**
             * Extract and return UUID for front or 'null' otherwise (https://.../ebf/uuid).
             * Length of UUID v4 is 36 chars.
             * @param {string} url
             * @return {string|null}
             */
            function getFrontUuid(url) {
                const parts = url.split('/');
                const streamUuid = parts.pop();
                return ((typeof streamUuid === 'string') && streamUuid.length === 36) ? streamUuid : null;
            }

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.MOD_WEB.SHARE_RES_STATUS)) {
                // extract front application UUID
                const frontUuid = getFrontUuid(req.url);
                if (req.method === HTTP2_METHOD_POST) {
                    // register UUID & public key for a new front in RDB
                    const dataIn = shares.get(DEF.MOD_WEB.SHARE_REQ_BODY_JSON);
                    const dataOut = await aSaveFront(dataIn);
                    shares.set(DEF.MOD_WEB.SHARE_RES_BODY, JSON.stringify(dataOut));
                } else if (req.method === HTTP2_METHOD_GET) {
                    // open new reverse stream (SSE) then authenticate front with public key
                    aOpenStream(res, frontUuid);
                } else respond400(res);
            }
        }

        // INSTANCE METHODS

        // noinspection JSUnusedGlobalSymbols
        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`Initialize Reverse Events Stream handler for web requests (back: ${_backUuid}).`);
        }

        // noinspection JSUnusedGlobalSymbols
        this.canProcess = function ({method, address} = {}) {
            return (
                ((method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST))
                && (address?.space === DEF.SHARED.SPACE_REVERSE)
            );
        }

    }
}
