/**
 * Plugin initialization function.
 * @namespace TeqFw_Plugin_Back_Plugin_Init
 */
// MODULE'S VARS
const NS = 'TeqFw_Plugin_Back_Plugin_Init';

export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance

    // FUNCS
    /**
     * @return {Promise<void>}
     * @memberOf TeqFw_Plugin_Back_Plugin_Init
     */
    async function action() { }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}
