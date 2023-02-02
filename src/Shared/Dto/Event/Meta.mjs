/**
 * Meta-data for simple event message.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Meta
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Meta';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Meta
 */
class Dto {
    static namespace = NS;
    /**
     * Name of the event (Prj_Back_Event_Msg_Name).
     * @type {string}
     */
    name;
    /**
     * UTC time for initial publication of the event in a channel.
     * @type {Date}
     */
    published;
    /**
     * UUID v4 for the event.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Meta {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Util_Crypto.randomUUID|function} */
        const randomUUID = spec['TeqFw_Core_Shared_Api_Util_Crypto.randomUUID'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}
         */
        this.createDto = function (data = null) {
            // create DTO and copy input data to this DTO
            const res = Object.assign(new Dto(), data);
            // cast data for known props
            res.name = castString(data?.name);
            res.published = castDate(data?.published) ?? new Date();
            res.uuid = castString(data?.uuid) ?? randomUUID(); // use shred util for shared code
            return res;
        }
    }
}
