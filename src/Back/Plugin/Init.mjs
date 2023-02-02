/**
 * Plugin initialization function.
 * @namespace TeqFw_Web_Event_Back_Plugin_Init
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Plugin_Init';

export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Event_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Web_Event_Back_Mod_Server_Key} */
    const modServerKey = spec['TeqFw_Web_Event_Back_Mod_Server_Key$'];
    /** @type {TeqFw_Web_Event_Back_Cron_Queue_Clean} */
    const cronClean = spec['TeqFw_Web_Event_Back_Cron_Queue_Clean$'];

    // FUNCS
    /**
     * @return {Promise<void>}
     * @memberOf TeqFw_Web_Event_Back_Plugin_Init
     */
    async function action() {
        // load or generate asymmetric keys for server to use in event processing
        await modServerKey.init();
        // run scheduled tasks
        cronClean.start().then();
        logger.info(`Plugin '${DEF.SHARED.NAME}' is initialized.`)
    }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}
