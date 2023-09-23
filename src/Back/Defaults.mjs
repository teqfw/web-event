/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class TeqFw_Web_Event_Back_Defaults {

    FILE_CRYPTO_KEYS = './cfg/local.crypto.keys.json';

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    /** @type {TeqFw_Web_Event_Shared_Defaults} */
    SHARED;

    TIMEOUT_EVENT_RESPONSE = 8000; // default timeout for response events (transborder)

    /**
     * @param {TeqFw_Web_Back_Defaults} MOD_WEB
     * @param {TeqFw_Web_Event_Shared_Defaults} SHARED
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: MOD_WEB,
            TeqFw_Web_Event_Shared_Defaults$: SHARED,
        }
    ) {
        // EXTRACT DEPS
        this.MOD_WEB = MOD_WEB;
        this.SHARED = SHARED;

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
