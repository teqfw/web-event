/**
 * Identity for frontend application (cookie, IDB, cache access).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Dto_Identity_Front';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Front_Dto_Identity_Front
 */
class Dto {
    static namespace = NS;
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
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Front_Dto_Identity_Front {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     * @param {TeqFw_Web_Event_Shared_Dto_Identity_Keys} dtoKeys
     */

    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
            TeqFw_Web_Event_Shared_Dto_Identity_Keys$: dtoKeys,
        }) {
        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Front_Dto_Identity_Front.Dto} [data]
         * @return {TeqFw_Web_Event_Front_Dto_Identity_Front.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.frontBid = castInt(data?.frontBid);
            res.frontKeys = dtoKeys.createDto(data?.frontKeys);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }
    }

}
