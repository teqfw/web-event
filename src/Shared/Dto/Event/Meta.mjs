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
    backUUID;
    /** @type {string} */
    frontUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Meta {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Mod_Event_Message_Meta} */
        const baseDto = spec['TeqFw_Core_Shared_Mod_Event_Message_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} data
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}
         */
        this.createDto = function (data) {
            // init base DTO and copy it to this DTO
            const base = baseDto.createDto(data);
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.backUUID = castString(data?.backUUID);
            res.frontUUID = castString(data?.frontUUID);
            return res;
        }
    }
}
