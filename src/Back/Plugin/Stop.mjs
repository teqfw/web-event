/**
 * Plugin finalization function.
 * @namespace TeqFw_Plugin_Back_Plugin_Stop
 */
// MODULE'S VARS
const NS = 'TeqFw_Plugin_Back_Plugin_Stop';

export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance

    // FUNCS
    /**
     * @return {Promise<void>}
     * @namespace TeqFw_Plugin_Back_Plugin_Stop
     */
    async function action() { }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}
