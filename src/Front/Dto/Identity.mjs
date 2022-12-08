/**
 * Front application identity.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Dto_Identity';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Front_Dto_Identity
 */
class Dto {
    static namespace = NS;
    /**
     * Server's public key for asymmetric encryption.
     * @type {string}
     */
    backKeyPublic;
    /** @type {string} */
    backUuid;
    /**
     * Backend ID for current front.
     * @type {number}
     */
    frontBid;
    /** @type {TeqFw_Web_Event_Shared_Dto_Identity_Keys.Dto} */
    frontKeys;
    /** @type {string} */
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Front_Dto_Identity {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Identity_Keys} */
        const dtoKeys = spec['TeqFw_Web_Event_Shared_Dto_Identity_Keys$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Front_Dto_Identity.Dto} [data]
         * @return {TeqFw_Web_Event_Front_Dto_Identity.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.backKeyPublic = castString(data?.backKeyPublic);
            res.backUuid = castString(data?.backUuid);
            res.frontBid = castInt(data?.frontBid);
            res.frontKeys = dtoKeys.createDto(data?.frontKeys);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }
    }

}
