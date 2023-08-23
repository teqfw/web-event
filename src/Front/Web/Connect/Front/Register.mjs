/**
 * Connector to send requests to back to save frontend UUID and public key in RDB.
 *
 * @namespace TeqFw_Web_Event_Front_Web_Connect_Front_Register
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Web_Connect_Front_Register';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
/**
 * @param {TeqFw_Web_Event_Front_Defaults} DEF
 */
export default function (
    {
        TeqFw_Web_Event_Front_Defaults$: DEF,
    }) {
    /** @type {TeqFw_Web_Front_Api_Gate_IErrorHandler} */
    const errHndl = spec['TeqFw_Web_Front_Api_Gate_IErrorHandler$'];
    /** @type {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} */
    const modState = spec['TeqFw_Web_Front_Api_Mod_Server_Connect_IState$'];
    /** @type {TeqFw_Web_Front_Mod_Config} */
    const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
    /** @type {TeqFw_Web_Event_Shared_Dto_Register_Request} */
    const dtoReq = spec['TeqFw_Web_Event_Shared_Dto_Register_Request$'];

    // VARS
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
            const space = `/${DEF.SHARED.SPACE_FRONT_REG}`;
            BASE = `${schema}${domain}${port}${root}${door}${space}`;
        }
        return BASE;
    }

    /**
     * Result function.
     * @param {string} frontUuid UUID for front application (stored in IDB)
     * @param {string} publicKey public key for front application (stored in IDB)
     * @return {Promise<number>} frontBid if front was successfully registered
     * @memberOf TeqFw_Web_Event_Front_Web_Connect_Front_Register
     */
    async function act(frontUuid, publicKey) {
        let res;
        const req = dtoReq.createDto();
        req.publicKey = publicKey;
        req.frontUuid = frontUuid;
        modState.startActivity(); // switch on led indicator
        try {
            const URL = `${baseUrl()}/${frontUuid}`;
            const fetched = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            });
            try {
                const frontBid = await fetched.json();
                res = (frontBid) ? Number.parseInt(frontBid) : null;
            } catch (e) {
                errHndl.error(e);
            }
        } catch (e) {
            errHndl.error(e);
        } finally {
            modState.stopActivity(); // switch off led indicator
        }
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
