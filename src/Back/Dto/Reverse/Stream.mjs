/**
 * DTO for 'back-to-front' connection to send server events to a front.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Dto_Reverse_Stream';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Back_Dto_Reverse_Stream
 */
class Dto {
    static namespace = NS;
    /**
     * Function with HTTPResponse object in own scope (closure) to close HTTP connection.
     * @type {function}
     */
    finalize;
    /**
     * Frontend application UUID.
     * @type {string}
     */
    frontUuid;
    /**
     * Incremental counter for event messages sent to the front.
     * @type {number}
     */
    messageId;
    /**
     * Connection state.
     * @type {string} see TeqFw_Web_Event_Back_Enum_Stream_State
     */
    state;
    /**
     * ID of the delayed function (setTimeout) to close unauthorized streams.
     * @type {Timeout}
     */
    unauthenticatedCloseId;
    /**
     * Stream UUID generated by backend. Used as frontend session UUID (tab in a browser).
     * @type {string}
     */
    uuid;
    /**
     * Function with HTTPResponse object in own scope (closure) to write out events messages.
     * @type {function}
     */
    write;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Event_Back_Dto_Reverse_Stream {

    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castFunction|function} */
        const castFunction = spec['TeqFw_Core_Shared_Util_Cast.castFunction'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {typeof TeqFw_Web_Event_Back_Enum_Stream_State} */
        const STATE = spec['TeqFw_Web_Event_Back_Enum_Stream_State$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto} [data]
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.finalize = castFunction(data?.finalize);
            res.frontUuid = castString(data?.frontUuid);
            res.messageId = castInt(data?.messageId) || 1;
            res.state = castString(data?.state) ?? STATE.OPENED;
            res.unauthenticatedCloseId = undefined; // don't init this property
            res.uuid = castString(data?.uuid);
            res.write = castFunction(data?.write);
            return res;
        }
    }

}
