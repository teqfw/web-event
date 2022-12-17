/**
 * Event message meta-data for transborder events.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta';

// MODULE'S CLASSES
/**
 * @extends TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta
 */
class Dto {
    static namespace = NS;
    /**
     * ID for event's producer (front or back).
     * @type {string}
     */
    agentUuid;
    /**
     * UTC time when event will be expired.
     * @type {Date}
     */
    expired;
    /**
     * ID for event's consumer (front or back).
     * @type {string}
     */
    sinkUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta} */
        const factBase = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta.Dto}
         */
        this.createDto = function (data = null) {
            // init base DTO and copy it to this DTO
            const base = factBase.createDto(data);
            const res = Object.assign(new Dto(), base);
            // cast data for known props
            res.agentUuid = castString(data?.agentUuid);
            res.expired = castDate(data?.expired);
            res.sinkUuid = castString(data?.sinkUuid);
            return res;
        }
    }
}
