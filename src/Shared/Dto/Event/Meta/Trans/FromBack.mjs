/**
 * Meta-data for back-to-front transborder event messages.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack
 * @extends TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto
 */
class Dto {
    static namespace = NS;
    /**
     * ID for event's producer (agent) that signs and encrypts message.
     * @type {string}
     */
    backUuid;
    /**
     * 'true' - message data is encrypted.
     * @type {boolean}
     */
    encrypted;
    /**
     * UTC time when event will be expired. 'null' - message will not be saved in queue if not sent.
     * @type {Date}
     */
    expired;
    /**
     * ID for event's consumer (sink) that verifies and decrypts message.
     * @type {string}
     */
    frontUuid;
    /**
     * ID of the event stream (browser tab) on the front. If not set then this message will be sent to all streams
     * of the front.
     */
    streamUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta} */
        const factBase = spec['TeqFw_Web_Event_Shared_Dto_Event_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBooleanIfExists|function} */
        const castBooleanIfExists = spec['TeqFw_Core_Shared_Util_Cast.castBooleanIfExists'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack.Dto}
         */
        this.createDto = function (data = null) {
            // create DTO and copy input data to this DTO
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_FromBack.Dto} */
            const res = factBase.createDto(data);
            // cast data for known props
            res.backUuid = castString(data?.backUuid);
            res.encrypted = castBooleanIfExists(data?.encrypted);
            res.expired = castDate(data?.expired);
            res.frontUuid = castString(data?.frontUuid);
            res.streamUuid = castString(data?.streamUuid);
            return res;
        }
    }
}
