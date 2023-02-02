/**
 * Keys for asymmetric encryption.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Identity_Keys';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Identity_Keys
 */
class Dto {
    static namespace = NS;
    /**
     * Base64 encoded public key.
     * @type {string}
     */
    public;
    /**
     * Base64 encoded secret key.
     * @type {string}
     */
    secret;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Shared_Dto_Identity_Keys {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Identity_Keys.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Identity_Keys.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.public = castString(data?.public);
            res.secret = castString(data?.secret);
            return res;
        }
    }
}
