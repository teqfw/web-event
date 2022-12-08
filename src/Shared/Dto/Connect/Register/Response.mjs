/**
 * Response from backend to request to register new front app.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Connect_Register_Response';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Connect_Register_Response
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    backKeyPublic;
    /** @type {string} */
    backUuid;
    /**
     * Backend ID for registered front.
     * @type {number}
     */
    frontBid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Connect_Register_Response {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Connect_Register_Response.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Connect_Register_Response.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.backKeyPublic = castString(data?.backKeyPublic);
            res.backUuid = castString(data?.backUuid);
            res.frontBid = castInt(data?.frontBid);
            return res;
        }
    }

}
