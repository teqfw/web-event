/**
 * HTTP connection to send frontend events to the server (direct event stream representation).
 * Contains connection UUID and uses SSE state model to reflect changes in connection state.
 */
export default class TeqFw_Web_Event_Front_Web_Connect_Direct {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Front_Mod_Config} */
        const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
        /** @type {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} */
        const modConn = spec['TeqFw_Web_Front_Api_Mod_Server_Connect_IState$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Identity_Session} */
        const modIdSession = spec['TeqFw_Web_Event_Front_Mod_Identity_Session$'];
        /** @type {TeqFw_Web_Event_Shared_Mod_Stamper} */
        const modStamper = spec['TeqFw_Web_Event_Shared_Mod_Stamper$'];

        // VARS
        let BASE;

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * Don't call this function in VARS section, because config is not loaded yet.
         * @return {string}
         * TODO: extract common code to util
         */
        function composeBaseUrl() {
            if (!BASE) {
                const cfg = modCfg.get();
                const schema = '//';
                const domain = cfg.urlBase ?? location.hostname;
                let port = location.port; // empty string for default ports (80 & 443)
                if (port !== '') port = `:${port}`
                const root = (cfg.root) ? `/${cfg.root}` : '';
                const door = (cfg.door) ? `/${cfg.door}` : '';
                const space = `/${DEF.SHARED.SPACE_DIRECT}`;
                BASE = `${schema}${domain}${port}${root}${door}${space}/`; // '/efb/' key in service worker!!
            }
            return BASE;
        }

        // INSTANCE METHODS

        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} data
         * @returns {Promise<{success: boolean, status:number}>} 'true' if
         */
        this.send = async function (data) {
            let success = false;
            let status;
            if (modConn.isOnline())
                try {
                    // noinspection JSValidateTypes
                    /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                    const meta = data.meta;
                    // const logMeta = dtoLogMeta.createDto();
                    // logMeta.backUuid = modIdFront.getBackUuid();
                    // logMeta.eventName = meta.name;
                    // logMeta.eventUuid = meta.uuid;
                    // logMeta.frontUuid = meta.sinkUuid;
                    // logMeta.streamUuid = meta.streamUuid;
                    //
                    modConn.startActivity();
                    meta.stamp = modStamper.create(meta, modIdSession.getScrambler());
                    const urlBase = composeBaseUrl();
                    const res = await fetch(`${urlBase}${meta.name}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    status = res.status;
                    const signature = `${meta.name} (${meta.uuid}): ${meta.frontUuid}/${meta.sessionUuid} => ${meta.backUuid}`;
                    if (status === 200) {
                        success = await res.json();
                        logger.info(`${signature}: success`);
                    } else if ((status === 403) || (status === 404)) {
                        // TODO: smell code, add normal error processing on the server side and here
                        const msg = await res.text();
                        logger.error(`${msg}: ${msg}`);
                        if (meta.backUuid)
                            logger.error(`Front '${meta.frontUuid}' it is not found on back '${meta.backUuid}'.`);
                    } else {
                        const msg = ` HTTP status = ${status}`;
                        logger.error(`${signature}: ${msg}`);
                    }
                } catch (e) {
                    // errHndl.error(e);
                    logger.error(e);
                } finally {
                    modConn.stopActivity();
                }
            return {success, status};
        }

    }
}
