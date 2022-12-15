/**
 * Message meta-data for transborder events.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Meta
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Meta';

// MODULE'S CLASSES
/**
 * @extends TeqFw_Core_Shared_Mod_Event_Message_Meta.Dto
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Meta
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    backUuid;
    /**
     * UUID for frontend session (tab in a browser) is generated on the back as stream UUID.
     * @type {string}
     */
    streamUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Meta {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Mod_Event_Message_Meta} */
        const dtoBase = spec['TeqFw_Core_Shared_Mod_Event_Message_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} data
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}
         */
        this.createDto = function (data) {
            // init base DTO and copy it to this DTO
            const base = dtoBase.createDto(data);
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} */
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.backUuid = castString(data?.backUuid);
            res.streamUuid = castString(data?.streamUuid);
            return res;
        }
    }
}
