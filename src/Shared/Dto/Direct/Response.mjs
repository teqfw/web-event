/**
 * Direct stream response for received front event.
 * It is not an event response, it is rather a REST response.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Direct_Response';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Direct_Response
 */
class Dto {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Direct_Response {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Direct_Response.Dto} data
         * @return {TeqFw_Web_Event_Shared_Dto_Direct_Response.Dto}
         */
        this.createDto = function (data = null) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.success = castBoolean(data?.success);
            return res;
        }
    }

}