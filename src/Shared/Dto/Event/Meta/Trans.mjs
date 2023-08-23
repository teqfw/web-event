/**
 * Metadata for transborder event messages.
 *
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans
 * @extends TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto
 */
class Dto {
    static namespace = NS;
    /**
     * Backend UUID to get keys for messages verification.
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
     * Frontend UUID to get keys for messages verification.
     * @type {string}
     */
    frontUuid;
    /**
     * ID for session on the front (tab in browser) that sends or receives messages.
     * @type {string}
     */
    sessionUuid;
    /**
     * Encrypted and signed metadata (part of attributes) to verify message by sink.
     * Is omitted if all data is encrypted (see `encrypted` attribute).
     * @type {string}
     */
    stamp;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans {
    /**
     * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta} factBase
     * @param {TeqFw_Core_Shared_Util_Cast.castBooleanIfExists|function} castBooleanIfExists
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            TeqFw_Web_Event_Shared_Dto_Event_Meta$: factBase,
            'TeqFw_Core_Shared_Util_Cast.castBooleanIfExists': castBooleanIfExists,
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto}
         */
        this.createDto = function (data = null) {
            // create DTO and copy input data to this DTO
            // noinspection JSValidateTypes
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
            const res = factBase.createDto(data);
            // cast data for known props
            res.backUuid = castString(data?.backUuid);
            res.encrypted = castBooleanIfExists(data?.encrypted);
            // TODO: should we save events to queue by default? Set 'expired = undefined' if should not.
            res.expired = data?.expired ? castDate(data?.expired)
                : new Date((new Date()).getTime() + 60000); // 1 minute by default
            res.frontUuid = castString(data?.frontUuid);
            res.sessionUuid = castString(data?.sessionUuid);
            res.stamp = castString(data?.stamp);
            return res;
        }
    }
}
