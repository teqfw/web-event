/**
 * Data for reverse stream activation (sent from front to back).
 * @namespace TeqFw_Web_Event_Shared_Dto_Stream_Act
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Stream_Act';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Stream_Act
 */
class Dto {
    static namespace = NS;
    /**
     * Frontend UUID.
     * @type {string}
     */
    frontUuid;
    /**
     * Value for stream UUID decrypted on the front.
     * @type {string}
     */
    streamUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Stream_Act {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Stream_Act.Dto|*} data
         * @return {TeqFw_Web_Event_Shared_Dto_Stream_Act.Dto}
         */
        this.createDto = function (data = null) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.frontUuid = castString(data?.frontUuid);
            res.streamUuid = castString(data?.streamUuid);
            return res;
        }
    }
}