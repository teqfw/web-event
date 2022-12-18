/**
 * Identity for currently connected backend.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Dto_Identity_Back';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Front_Dto_Identity_Back
 */
class Dto {
    static namespace = NS;
    /**
     * Public key for backend.
     * @type {string}
     */
    backKey;
    /** @type {string} */
    backUuid;
    /**
     * UUID for SSE stream to get back-to-front events.
     * @type {string}
     */
    streamUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Front_Dto_Identity_Back {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto} [data]
         * @return {TeqFw_Web_Event_Front_Dto_Identity_Back.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.backKey = castString(data?.backKey);
            res.backUuid = castString(data?.backUuid);
            res.streamUuid = castString(data?.streamUuid);
            return res;
        }
    }

}
