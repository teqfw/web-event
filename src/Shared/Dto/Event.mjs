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
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event {
    /**
     * @param {TeqFw_Core_Shared_Dto_Any} factData
     * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta} factMeta
     */
    constructor(
        {
            TeqFw_Core_Shared_Dto_Any$: factData,
            TeqFw_Web_Event_Shared_Dto_Event_Meta$: factMeta,
        }) {
        // INSTANCE METHODS

        this.createDto = function (dto) {
            // create DTO and copy input data to this DTO
            /** @type {TeqFw_Web_Event_Shared_Dto_Event.Dto} */
            const res = Object.assign(new Dto(), dto);
            // cast data for known props
            res.data = factData.createDto(dto?.data);
            res.meta = factMeta.createDto(dto?.meta);
            // set event namespace
            if (dto?.data?.constructor?.namespace) res.meta.name = dto.data.constructor.namespace;
            return res;
        }
    }
}