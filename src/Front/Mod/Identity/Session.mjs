/**
 * Frontend session identity (UUID). Session is a tab in a browser.
 * Model saves data in browser's Session Storage.
 */
// MODULE'S VARS
const KEY = '@teqfw/web-event/sessionUuid';

// MODULE'S CLASSES
export default class TeqFw_Web_Event_Front_Mod_Identity_Session {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance

        // VARS
        logger.setNamespace(this.constructor.name);
        /** @type {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto} */
        let _backId;
        /** @type {string} */
        let _sessionUuid = initSession();

        // FUNCS
        /**
         * Load sessionUuid from Session Store or generate new one.
         * @returns {string}
         */
        function initSession() {
            let res = self.sessionStorage.getItem(KEY);
            if (!res) {
                res = self.crypto.randomUUID();
                self.sessionStorage.setItem(KEY, res);
            }
            return res;
        }

        // INSTANCE METHODS

        /**
         * Get UUID for current backend.
         * @return {string}
         */
        this.getBackUuid = () => _backId?.backUuid;

        /**
         * Get backend public key for asymmetric encryption.
         * @return {string}
         */
        this.getBackKey = () => _backId?.backKey;

        /**
         * Get UUID for current session (tab in a browser).
         * @return {string}
         */
        this.getSessionUuid = () => _sessionUuid;

        /**
         * Get UUID for SSE stream to receive back-to-front events.
         * @return {string}
         */
        this.getStreamUuid = () => _backId?.streamUuid;

        /**
         * @param {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto} data
         */
        this.setIdBack = (data) => _backId = data;
    }
}
