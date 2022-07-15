/**
 * Message meta-data for transborder event that is a response message.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Response_Meta
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Response_Meta';

// MODULE'S CLASSES
/**
 * @extends TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Response_Meta
 */
class Dto {
    static namespace = NS;
    /**
     * UUID for request event message if this message is response.
     * @type {string}
     */
    requestUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Response_Meta {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta} */
        const baseDto = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Response_Meta.Dto} data
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Response_Meta.Dto}
         */
        this.createDto = function (data) {
            // init base DTO and copy it to this DTO
            const base = baseDto.createDto(data);
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.requestUUID = castString(data?.requestUUID);
            return res;
        }
    }
}
