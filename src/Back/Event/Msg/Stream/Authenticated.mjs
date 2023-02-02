/**
 * This local event is produced when newly opened SSE connection (reverse stream) is authenticated.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated
 */
class Dto {
    static namespace = NS;
    /**
     * Backend ID of the front bound to authenticated stream.
     * @type {number}
     */
    frontBid;
    /**
     * UUID of the front bound to authenticated stream.
     * @type {string}
     */
    frontUuid;
    /**
     * UUID of the front session bound to authenticated stream.
     * @type {string}
     */
    sessionUuid;

    /**
     * UUID of the authenticated stream itself.
     * @type {string}
     */
    streamUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated.Dto} [data]
         * @return {TeqFw_Web_Event_Back_Event_Msg_Stream_Authenticated.Dto}
         */
        this.createDto = function (data = null) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.frontBid = castInt(data?.frontBid);
            res.frontUuid = castString(data?.frontUuid);
            res.sessionUuid = castString(data?.sessionUuid);
            res.streamUuid = castString(data?.streamUuid);
            return res;
        }
    }
}
