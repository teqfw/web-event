/**
 * Web server handler to establish new SSE connection with front.
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const {
    HTTP2_METHOD_GET,
} = H2;

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Event_Back_Web_Handler_Stream_Open {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act|function} */
        const aOpenStream = spec['TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open
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
                // open new reverse stream (SSE) then authenticate front with public key
                aOpenStream(res, frontUuid);
            }
        }

        Object.defineProperty(process, 'namespace', {value: this.constructor.name});

        // INSTANCE METHODS

        // noinspection JSUnusedGlobalSymbols
        this.getProcessor = () => process;

        this.init = async function () {
            const space = DEF.SHARED.SPACE_STREAM_OPEN;
            logger.info(`Initialize SSE connections handler for web requests (space: '${space}').`);
        }

        // noinspection JSUnusedGlobalSymbols
        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_GET)
                && (address?.space === DEF.SHARED.SPACE_STREAM_OPEN)
            );
        }

    }
}
