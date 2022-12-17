/**
 * TODO: remove it if not useful
 * Base structure and factory for regular event message DTO.
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
 * @implements TeqFw_Web_Event_Shared_Api_Event_Factory
 */
export default class TeqFw_Web_Event_Shared_Dto_Event {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Dto_Any} */
        const factData = spec['TeqFw_Core_Shared_Dto_Any$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta} */
        const factMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta$'];

        // INSTANCE METHODS
        this.buildData = factData.createDto;
        this.buildMeta = factMeta.createDto;

        /**
         *
         * @param {Object} data
         * @returns {TeqFw_Web_Event_Shared_Dto_Event.Dto}
         */
        this.createEvent = function (data = null) {
            const res = new Dto();
            Object.assign(res, data);
            if (typeof this?.buildData === 'function')
                res.data = this.buildData(data?.data);
            if (typeof this?.buildMeta === 'function')
                res.meta = this.buildMeta(data?.meta);
            res.meta.name = this.getName();
            return res;
        }

        this.getName = () => NS;
    }
}