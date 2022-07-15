/**
 * Base structure for transborder event message.
 * @namespace TeqFw_Web_Event_Shared_Dto_Event
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event
 * @type {Object}
 */
const ATTR = {
    DATA: 'data',
    META: 'meta',
    STAMP: 'stamp',
};

/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event
 * @extends TeqFw_Core_Shared_Mod_Event_Message.Dto
 */
class Dto {
    static namespace = NS;
    /** @type {Object} */
    data;
    /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} */
    meta;
    /**
     * Contains encrypted data (uuid & data from meta) to verify sender and receiver.
     * @type {string}
     */
    stamp;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Event_Shared_Dto_Event {
    constructor(spec) {
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta} */
        const dtoMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto|*} data
         * @return {TeqFw_Web_Event_Shared_Dto_Event.Dto}
         */
        this.createDto = function (data = null) {
            // init base DTO and copy it to this DTO
            const res = Object.assign(new Dto(), data);
            // then init this DTO props
            // res.data = dtoFormless.createDto(data?.[ATTR.DATA]);
            res.meta = dtoMeta.createDto(data?.[ATTR.META]);
            res.stamp = castString(data?.stamp);
            return res;
        }


        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
