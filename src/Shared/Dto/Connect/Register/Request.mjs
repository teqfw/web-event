/**
 * Request to backend to register new front app.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Connect_Register_Request';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Connect_Register_Request
 */
class Dto {
    static namespace = NS;
    /**
     * Front's public key for asymmetric encryption.
     * @type {string}
     */
    publicKey;
    /**
     * Front's UUID.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Connect_Register_Request {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Connect_Register_Request.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Connect_Register_Request.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.publicKey = castString(data?.publicKey);
            res.uuid = castString(data?.uuid);
            return res;
        }
    }

}
