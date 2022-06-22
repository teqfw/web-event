/**
 * Plugin initialization function.
 * @namespace TeqFw_Web_Event_Back_Plugin_Init
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Plugin_Init';

export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance

    // FUNCS
    /**
     * @return {Promise<void>}
     * @memberOf TeqFw_Web_Event_Back_Plugin_Init
     */
    async function action() {
        await container.get('TeqFw_Web_Event_Back_Listen_Front_Authenticate$');
        await container.get('TeqFw_Web_Event_Back_Listen_Server_Key_Source$');
    }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}
