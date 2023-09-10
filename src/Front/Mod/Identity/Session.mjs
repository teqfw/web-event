/**
 * Frontend session identity (UUID). Session is a tab in a browser.
 * Model saves data in browser's Session Storage.
 */
// MODULE'S VARS
const KEY = '@teqfw/web-event/sessionUuid';

// MODULE'S CLASSES
export default class TeqFw_Web_Event_Front_Mod_Identity_Session {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
        }) {
        // VARS
        /** @type {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto} */
        let _backId;
        /** @type {string} */
        let _sessionUuid = initSession();
        /** @type {TeqFw_Web_Event_Shared_Api_Crypto_Scrambler} */
        let _scrambler;

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
         * @returns {TeqFw_Web_Event_Shared_Api_Crypto_Scrambler}
         */
        this.getScrambler = () => _scrambler;

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

        /**
         * @param {TeqFw_Web_Event_Shared_Api_Crypto_Scrambler} data
         */
        this.setScrambler = (data) => _scrambler = data;
    }
}
