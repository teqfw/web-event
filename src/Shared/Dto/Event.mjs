/**
 * Base structure and factory for regular event message.
 * @namespace TeqFw_Web_Event_Shared_Dto_Event
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event
 */
class Dto {
    static namespace = NS;
    /** @type {Object} */
    data;
    /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} */
    meta;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Dto_Any} */
        const factData = spec['TeqFw_Core_Shared_Dto_Any$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta} */
        const factMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta$'];

        // INSTANCE METHODS

        this.createDto = function (data) {
            // create DTO and copy input data to this DTO
            /** @type {TeqFw_Web_Event_Shared_Dto_Event.Dto} */
            const res = Object.assign(new Dto(), data);
            // cast data for known props
            res.data = factData.createDto(data?.data);
            res.meta = factMeta.createDto(data?.meta);
            return res;
        }
    }
}