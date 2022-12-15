/**
 * Model encapsulates backend identity (UUID & public key). Model saves data internally (in variable).
 */
export default class TeqFw_Web_Event_Front_Mod_Identity_Back {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance

        // VARS
        logger.setNamespace(this.constructor.name);
        /** @type {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto} */
        let _cache;

        // INSTANCE METHODS

        /**
         * @param {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto} data
         */
        this.set = (data) => _cache = data;

        /**
         * Get backend public key for asymmetric encryption.
         * @return {string}
         */
        this.getPublicKey = () => _cache?.backKey;

        /**
         * Get UUID for current backend.
         * @return {string}
         */
        this.getBackUuid = () => _cache?.backUuid;

    }
}
