/**
 * Server events stream authentication DTO (sent from back to front).
 * @namespace TeqFw_Web_Event_Shared_Dto_Stream_Auth
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Stream_Auth';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Stream_Auth
 */
class Dto {
    static namespace = NS;
    /**
     * Public key for backend.
     * @type {string}
     */
    backKey;
    /**
     * Backend UUID.
     * @type {string}
     */
    backUuid;
    /**
     * Encrypted stream UUID.
     * @type {string}
     */
    streamUuidEnc;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Stream_Auth {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Stream_Auth.Dto|*} data
         * @return {TeqFw_Web_Event_Shared_Dto_Stream_Auth.Dto}
         */
        this.createDto = function (data = null) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.backKey = castString(data?.backKey);
            res.backUuid = castString(data?.backUuid);
            res.streamUuidEnc = castString(data?.streamUuidEnc);
            return res;
        }
    }
}