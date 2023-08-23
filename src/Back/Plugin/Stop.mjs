/**
 * Plugin finalization function.
 * @namespace TeqFw_Web_Event_Back_Plugin_Stop
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Plugin_Stop';
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Web_Event_Back_Cron_Queue_Clean} cronClean
 */

export default function (
    {
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Web_Event_Back_Cron_Queue_Clean$: cronClean,
    }) {
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
