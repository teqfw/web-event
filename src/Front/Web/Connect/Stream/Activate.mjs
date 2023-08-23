/**
 * Connector to send POST request to activate reverse events stream (SSE).
 *
 * @namespace TeqFw_Web_Event_Front_Web_Connect_Stream_Activate
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Web_Connect_Stream_Activate';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
/**
 * @param {TeqFw_Web_Event_Front_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Web_Event_Front_Mod_Channel} eventsFront
 * @param {TeqFw_Web_Event_Front_Mod_Portal_Back} portalBack
 * @param {TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated} efAuth
 * @param {TeqFw_Web_Front_Mod_Config} modCfg
 * @param {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} modState
 * @param {TeqFw_Web_Event_Shared_Dto_Stream_Act} dtoAct
 */
export default function (
    {
        TeqFw_Web_Event_Front_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Web_Event_Front_Mod_Channel$: eventsFront,
        TeqFw_Web_Event_Front_Mod_Portal_Back$: portalBack,
        TeqFw_Web_Event_Front_Event_Msg_Stream_Authenticated$: efAuth,
        TeqFw_Web_Front_Mod_Config$: modCfg,
        TeqFw_Web_Front_Api_Mod_Server_Connect_IState$: modState,
        TeqFw_Web_Event_Shared_Dto_Stream_Act$: dtoAct,
    }) {
    // VARS
    logger.setNamespace(NS);
    let BASE;

    // FUNCS

    /**
     * Don't call this function in VARS section, because config is not loaded yet.
     * @return {string}
     * TODO: extract common code to util
     */
    function baseUrl() {
        if (!BASE) {
            const cfg = modCfg.get();
            const schema = '//';
            const domain = cfg?.urlBase ?? location.hostname;
            let port = location.port; // empty string for default ports (80 & 443)
            if (port !== '') port = `:${port}`
            const root = (cfg?.root) ? `/${cfg.root}` : '';
            const door = (cfg?.door) ? `/${cfg.door}` : '';
            const space = `/${DEF.SHARED.SPACE_STREAM_ACTIVATE}`;
            BASE = `${schema}${domain}${port}${root}${door}${space}`;
        }
        return BASE;
    }

    /**
     * Send decrypted streamUuid and current frontUuid to activate stream on the back.
     * @param {string} frontUuid
     * @param {string} streamUuid
     * @memberOf TeqFw_Web_Event_Front_Web_Connect_Stream_Activate
     */
    async function act(frontUuid, streamUuid) {
        modState.startActivity(); // switch on led indicator
        try {
            // compose request data
            const req = dtoAct.createDto();
            req.frontUuid = frontUuid;
            req.streamUuid = streamUuid;
            // send data to the back
            const URL = baseUrl();
            const fetched = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            });
            const res = await fetched.json();
            if (res === true) {
                logger.info(`Stream '${streamUuid}' for front '${frontUuid}' is active now.`);
                const data = efAuth.createDto();
                data.frontUuid = frontUuid;
                /** @type {TeqFw_Web_Event_Shared_Dto_Event.Dto} */
                const msg = eventsFront.createMessage({data});
                await eventsFront.publish(msg);
                // process delayed events
                portalBack.sendDelayedEvents().then();
            }
        } catch (e) {
            logger.error(`Cannot send stream activation request to back. Error: ${e?.message}`);
        } finally {
            modState.stopActivity(); // switch off led indicator
        }
    }

    Object.defineProperty(act, 'namespace', {value: NS});

    // MAIN
    return act;
}
