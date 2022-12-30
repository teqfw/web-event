/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class TeqFw_Web_Event_Front_Defaults {
    /** @type {TeqFw_Web_Front_Defaults} */
    MOD_WEB;
    /** @type {TeqFw_Web_Event_Shared_Defaults} */
    SHARED;

    STORE_REVERSE_BACK_UUID = `@teqfw/web-event/reverseBackUuid`;
    STORE_REVERSE_STREAM_UUID = `@teqfw/web-event/reverseStreamUuid`;

    TIMEOUT_EVENT_RESPONSE = 8000; // default timeout for response events (transborder)

    constructor(spec) {
        // EXTRACT DEPS
        this.MOD_WEB = spec['TeqFw_Web_Front_Defaults$'];
        this.SHARED = spec['TeqFw_Web_Event_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
