/**
 * Plugin finalization function.
 * @namespace TeqFw_Web_Event_Back_Plugin_Stop
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Plugin_Stop';

export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Web_Event_Back_Cron_Queue_Clean} */
    const cronClean = spec['TeqFw_Web_Event_Back_Cron_Queue_Clean$'];

    // FUNCS
    /**
     * @return {Promise<void>}
     * @namespace TeqFw_Web_Event_Back_Plugin_Stop
     */
    async function action() {
        cronClean.stop();
    }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}
