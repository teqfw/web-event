/**
 * Model encapsulates front application's identity (UUID & asymmetric keys for front, public key & UUID for back).
 * Generate identity (UUID & asymmetric key) and send public parts (UUID & public key) to the server.
 */
export default class TeqFw_Web_Event_Front_Mod_Identity_Front {
    /**
     * @param {TeqFw_Web_Event_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Front_Mod_Store_Singleton} storeSingleton
     * @param {TeqFw_Web_Event_Front_Dto_Identity_Front} dtoIdentity
     * @param {TeqFw_Web_Event_Shared_Api_Crypto_Key_Manager} mgrKeys
     * @param {TeqFw_Web_Event_Front_Web_Connect_Front_Register.act|function} connRegFront
     */
    constructor(
        {
            TeqFw_Web_Event_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Front_Mod_Store_Singleton$: storeSingleton,
            TeqFw_Web_Event_Front_Dto_Identity_Front$: dtoIdentity,
            TeqFw_Web_Event_Shared_Api_Crypto_Key_Manager$: mgrKeys,
            TeqFw_Web_Event_Front_Web_Connect_Front_Register$: connRegFront,
        }) {
        // VARS
        logger.setNamespace(this.constructor.name);
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/identity`;
        /** @type {TeqFw_Web_Event_Front_Dto_Identity_Front.Dto} */
        let _cache;

        // INSTANCE METHODS
        /**
         * Load application identity from IDB or generate new identity and register it on backend.
         * @return {Promise<void>}
         */
        this.init = async function () {
            /** @type {TeqFw_Web_Event_Front_Dto_Identity_Front.Dto} */
            const found = await storeSingleton.get(KEY_IDENTITY);
            if (found) _cache = found;
            else {
                // this is first run, create identity and send it to the back
                const dto = dtoIdentity.createDto();
                dto.frontUuid = self.crypto.randomUUID();
                dto.frontKeys = await mgrKeys.generateAsyncKeys();
                /** @type {number|null} */
                const frontBid = await connRegFront(dto.frontUuid, dto.frontKeys.public);
                if (frontBid) {
                    dto.frontBid = frontBid;
                    logger.info(`Front '${dto.frontUuid}' is registered as #${frontBid} on the back.`);
                    await storeSingleton.set(KEY_IDENTITY, dto);
                    _cache = dto;
                } else {
                    throw new Error('Fatal error. Cannot register new identity on the back.');
                }
            }
        }

        /**
         * @return {TeqFw_Web_Event_Front_Dto_Identity_Front.Dto}
         */
        this.get = () => _cache;
        /**
         * Get backend public key for asymmetric encryption.
         * @return {string}
         * TODO: remove unused methods
         */
        this.getBackKey = () => _cache?.backKeyPublic;

        /**
         * Get UUID for current backend.
         * @return {string}
         */
        this.getBackUuid = () => _cache?.backUuid;

        /**
         * Auth ID from backend RDB.
         * @return {number}
         */
        this.getFrontBid = () => _cache?.frontBid;

        /**
         * @return {string}
         */
        this.getFrontUuid = () => _cache?.frontUuid;

        /**
         * Auth's public key for asymmetric encryption.
         * @type {string}
         */
        this.getPublicKey = () => _cache?.frontKeys?.public;

        /**
         * Auth's secret key for asymmetric encryption.
         * @type {string}
         */
        this.getSecretKey = () => _cache?.frontKeys?.secret;

        /**
         * Server stream UUID for current session (tab in a browser).
         * @returns {string}
         */
        this.getStreamUuid = () => {
            return sessionStorage.getItem(DEF.STORE_REVERSE_STREAM_UUID);
        }

        /**
         * Server stream UUID for current session (tab in a browser).
         * @param {string} uuid
         */
        this.setStreamUuid = (uuid) => {
            return sessionStorage.setItem(DEF.STORE_REVERSE_STREAM_UUID, uuid);
        }

        /**
         * UUID of backend to communicate in current session (tab in a browser).
         * @param {string} uuid
         */
        this.setBackUuid = (uuid) => {
            return sessionStorage.setItem(DEF.STORE_REVERSE_BACK_UUID, uuid);
        }

    }
}
