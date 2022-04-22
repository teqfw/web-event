/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class TeqFw_Plugin_Back_Defaults {

    CLI_PREFIX = 'plugin'; // prefix in CLI commands

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    /** @type {TeqFw_Plugin_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        // EXTRACT DEPS
        this.MOD_WEB = spec['TeqFw_Web_Back_Defaults$'];
        this.SHARED = spec['TeqFw_Plugin_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
