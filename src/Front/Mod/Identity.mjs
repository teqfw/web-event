/**
 * Model encapsulates front application's identity (UUID & asymmetric keys for front, public key & UUID for back).
 * Generate identity (UUID & asymmetric key) and send public parts (UUID & public key) to the server.
 */
export default class TeqFw_Web_Event_Front_Mod_Identity {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const storeSingleton = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];
        /** @type {TeqFw_Web_Event_Front_Dto_Identity} */
        const dtoIdentity = spec['TeqFw_Web_Event_Front_Dto_Identity$'];
        /** @type {TeqFw_Web_Event_Shared_Api_Crypto_Key_IManager} */
        const mgrKeys = spec['TeqFw_Web_Event_Shared_Api_Crypto_Key_IManager$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Connect} */
        const connAuth = spec['TeqFw_Web_Event_Front_Mod_Connect$'];

        // VARS
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/identity`;
        /** @type {TeqFw_Web_Event_Front_Dto_Identity.Dto} */
        let _cache;

        // INSTANCE METHODS
        /**
         * Load application identity from IDB or generate new identity and register it on backend.
         * @return {Promise<void>}
         */
        this.init = async function () {
            /** @type {TeqFw_Web_Event_Front_Dto_Identity.Dto} */
            const found = await storeSingleton.get(KEY_IDENTITY);
            if (found) _cache = found;
            else {
                // this is first run, create identity and send it to the back
                const dto = dtoIdentity.createDto();
                dto.frontUuid = self.crypto.randomUUID();
                dto.frontKeys = await mgrKeys.generateAsyncKeys();
                const regData = await connAuth.register(dto.frontUuid, dto.frontKeys.public);
                if (regData) {
                    dto.frontBid = regData.frontBid;
                    dto.backKeyPublic = regData.backKeyPublic;
                    dto.backUuid = regData.backUuid;
                    await storeSingleton.set(KEY_IDENTITY, dto);
                    _cache = dto;
                } else {
                    throw new Error('Fatal error. Cannot register new identity on the back.');
                }
            }
        }

        /**
         * Register current identity on backend.
         * @return {Promise<void>}
         * @deprecated we don't use this method in event plugin more
         */
        this.registerOnBack = async function () {
            /** @type {TeqFw_Web_Event_Front_Dto_Identity.Dto} */
            const found = await storeSingleton.get(KEY_IDENTITY);
            if (found) {
                const regData = await connAuth.register(found.frontUuid, found.frontKeys.public);
                if (regData) {
                    found.frontBid = regData.frontBid;
                    found.backKeyPublic = regData.backKeyPublic;
                    found.backUuid = regData.backUuid;
                    await storeSingleton.set(KEY_IDENTITY, found);
                    _cache = found;
                } else throw new Error('Fatal error. Cannot register existing front app on the back.');
            } else throw new Error('Fatal error. Cannot get front identity from IDB.');
        }

        /**
         * @return {TeqFw_Web_Event_Front_Dto_Identity.Dto}
         */
        this.get = () => _cache;
        /**
         * Get backend public key for asymmetric encryption.
         * @return {string}
         */
        this.getBackKey = () => _cache?.backKeyPublic;

        /**
         * Get UUID for current backend.
         * @return {string}
         */
        this.getBackUuid = () => _cache?.backUuid;

        /**
         * Front ID from backend RDB.
         * @return {number}
         */
        this.getFrontBid = () => _cache?.frontBid;

        /**
         * @return {string}
         */
        this.getFrontUuid = () => _cache?.frontUuid;

        /**
         * Front's public key for asymmetric encryption.
         * @type {string}
         */
        this.getPublicKey = () => _cache?.frontKeys?.public;
        /**
         * Front's secret key for asymmetric encryption.
         * @type {string}
         */
        this.getSecretKey = () => _cache?.frontKeys?.secret;

        this.getTabUuid = () => {
            let res = sessionStorage.getItem(DEF.STORE_SESS_KEY_TAB_UUID);
            if (!res) {
                res = self.crypto.randomUUID();
                sessionStorage.setItem(DEF.STORE_SESS_KEY_TAB_UUID, res);
            }
            return res;
        }

    }
}
