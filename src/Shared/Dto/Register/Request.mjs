/**
 * Save frontend UUID and public key to back.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Register_Request';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Register_Request
 */
class Dto {
    static namespace = NS;
    /**
     * Auth's public key for asymmetric encryption.
     * @type {string}
     */
    publicKey;
    /**
     * Auth's UUID.
     * @type {string}
     */
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Register_Request {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Register_Request.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Register_Request.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.publicKey = castString(data?.publicKey);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }
    }

}
