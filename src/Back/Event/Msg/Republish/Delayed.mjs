/**
 * Delayed events for some front app were re-published by back.
 * TODO: remove it if not used
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed
 */
class Dto {
    static namespace = NS;
    /**
     * Number of re-published events.
     * @type {number}
     */
    count;
    /**
     * Auth application ID in backend RDB.
     * @type {number}
     */
    frontId;
    /** @type {string} */
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed.Dto} [data]
         * @return {TeqFw_Web_Event_Back_Event_Msg_Republish_Delayed.Dto}
         */
        this.createDto = function (data = null) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.count = castInt(data?.count);
            res.frontId = castInt(data?.frontId);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }
    }
}
