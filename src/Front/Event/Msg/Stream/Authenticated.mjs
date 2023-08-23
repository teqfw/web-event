/**
 * Local event 'Server events stream is authenticated'.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated
 */
class Dto {
    static namespace = NS; // used as event name
    /** @type {number} */
    frontBid;
    /** @type {string} */
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated.Dto} [data]
         * @returns {TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.frontBid = castInt(data?.frontBid);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }
    }
}
