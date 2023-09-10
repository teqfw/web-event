/**
 * Plugin initialization function.
 * @namespace TeqFw_Web_Event_Back_Plugin_Init
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Plugin_Init';
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Web_Event_Back_Mod_Server_Key} modServerKey
 * @param {TeqFw_Web_Event_Back_Cron_Queue_Clean} cronClean
 */

export default function (
    {
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Web_Event_Back_Mod_Server_Key$: modServerKey,
        TeqFw_Web_Event_Back_Cron_Queue_Clean$: cronClean,
    }) {

    // FUNCS
    /**
     * @return {Promise<void>}
     * @memberOf TeqFw_Web_Event_Back_Plugin_Init
     */
    async function action() {
        // load or generate asymmetric keys for server to use in event processing
        await modServerKey.init();
        // run scheduled tasks
        cronClean.start().catch(logger.error);
    }

    // MAIN
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}
