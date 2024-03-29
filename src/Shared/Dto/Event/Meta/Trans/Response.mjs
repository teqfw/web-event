/**
 * Meta-data for transborder event messages that are call responses.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response
 * @extends TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto
 */
class Dto {
    static namespace = NS;
    /**
     * UUID for request that this response corresponds to.
     * @type {string}
     */
    requestUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response {
    /**
     * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans} factBase
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans$: factBase,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response.Dto}
         */
        this.createDto = function (data) {
            // create DTO and copy input data to this DTO
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response.Dto} */
            const res = factBase.createDto(data);
            // cast data for known props
            res.requestUuid = castString(data?.requestUuid);
            return res;
        }
    }
}
