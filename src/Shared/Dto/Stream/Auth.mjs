/**
 * Data for reverse stream authentication (sent from back to front).
 * @namespace TeqFw_Web_Event_Shared_Dto_Stream_Auth
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Stream_Auth';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Stream_Auth
 * @type {Object}
 */
const ATTR = {
    BACK_KEY: 'backKey',
    BACK_UUID: 'backUuid',
    STREAM_UUID_ENC: 'streamUuidEnc',
};
Object.freeze(ATTR);

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
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
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
            const res = new Dto();
            res.backKey = castString(data?.backKey);
            res.backUuid = castString(data?.backUuid);
            res.streamUuidEnc = castString(data?.streamUuidEnc);
            return res;
        }

        this.getAttributes = () => ATTR;
    }
}