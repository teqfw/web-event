/**
 * Base structure for transborder event message that is response to other transborder event message (request).
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Response
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Response';

// MODULE'S CLASSES

/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Response
 * @extends TeqFw_Web_Event_Shared_Dto_Event.Dto
 */
class Dto {
    static namespace = NS;
    /** @type {TeqFw_Web_Event_Shared_Dto_Event_Response_Meta.Dto} */
    meta;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Response {
    constructor(spec) {
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Response_Meta} */
        const dtoMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Response_Meta$'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Response.Dto|*} data
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Response.Dto}
         */
        this.createDto = function (data = null) {
            // init base DTO and copy it to this DTO
            const base = dtoBase.createDto(data);
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.meta = dtoMeta.createDto(data?.[ATTR.META]);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }
}
