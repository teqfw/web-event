/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class TeqFw_Plugin_Front_Defaults {

    /** @type {TeqFw_Plugin_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        // EXTRACT DEPS
        this.SHARED = spec['TeqFw_Plugin_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
