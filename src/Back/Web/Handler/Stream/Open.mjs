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
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
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
             * Extract and return UUIDs for front & session (https://.../ebf/frontUuid/sessionUuid).
             * Length of UUID v4 is 36 chars.
             * @param {string} url
             * @return {{frontUuid: string, sessionUuid: string}}
             */
            function getUuids(url) {
                const parts = url.split('/');
                const sessionRaw = parts.pop();
                const frontRaw = parts.pop();
                const sessionUuid = ((typeof sessionRaw === 'string') && sessionRaw.length === 36) ? sessionRaw : null;
                const frontUuid = ((typeof frontRaw === 'string') && frontRaw.length === 36) ? frontRaw : null;
                return {sessionUuid, frontUuid};
            }

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                // extract front application UUID
                const {sessionUuid, frontUuid} = getUuids(req.url);
                // open new reverse stream (SSE) then authenticate front with public key
                await aOpenStream(res, frontUuid, sessionUuid);
            }
        }

        Object.defineProperty(process, 'namespace', {value: this.constructor.name});

        // INSTANCE METHODS

        // noinspection JSUnusedGlobalSymbols
        this.getProcessor = () => process;

        this.init = async function () {
            const space = DEF.SHARED.SPACE_STREAM_OPEN;
            logger.info(`Initialize handler for SSE stream opening (space: '${space}').`);
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
