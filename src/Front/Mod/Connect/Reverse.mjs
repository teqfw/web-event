/**
 * Connection to SSE source (reverse event stream representation).
 * It uses SSE state model to reflect changes in connection state.
 * Connection uses frontUUID to connect to backend and saves backendUUID when connected.
 */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/readyState
 */
const SSE_STATE = {
    CLOSED: 2,
    CONNECTING: 0,
    OPEN: 1,
};

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Core_Shared_Api_Event_IBus
 */
export default class TeqFw_Web_Event_Front_Mod_Connect_Reverse {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Auth_Front_Mod_Identity} */
        const modIdentity = spec['TeqFw_Web_Auth_Front_Mod_Identity$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventFront = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const factTransMsg = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Web_Event_Front_Event_Connect_Reverse_Closed} */
        const efClosed = spec['TeqFw_Web_Event_Front_Event_Connect_Reverse_Closed$'];
        /** @type {TeqFw_Web_Event_Front_Event_Connect_Reverse_Opened} */
        const efOpened = spec['TeqFw_Web_Event_Front_Event_Connect_Reverse_Opened$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticate_Request} */
        const esbAuthReq = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticate_Request$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Front_Stream_Reverse_Authenticate_Response} */
        const esfAuthRes = spec['TeqFw_Web_Event_Shared_Event_Front_Stream_Reverse_Authenticate_Response$'];
        /** @type {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} */
        const modConn = spec['TeqFw_Web_Front_Api_Mod_Server_Connect_IState$'];
        /** @type {TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler.Factory} */
        const factScrambler = spec['TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler.Factory$'];

        // VARS
        /** @type {EventSource} */
        let _source;
        let _url = `./${DEF.SHARED.SPACE_REVERSE}`;

        // MAIN
        window.addEventListener('offline', closeStream);
        window.addEventListener('online', openStream);
        logger.setNamespace(this.constructor.name);

        // FUNCS
        function closeStream() {
            if (_source && (_source.readyState !== SSE_STATE.CLOSED)) {
                _source.close();
                eventFront.publish(efClosed.createDto());
                logger.info(`Reverse events stream connection is closed.`);
            }
            modConn.setOffline();
        }

        /**
         * Open SSE connection and set handlers for input data.
         */
        function openStream() {
            // FUNCS
            /**
             * Listener for SSE authentication event from the back.
             * Save back identity to front model, encrypt back payload and return to back.
             * @param {MessageEvent} event
             */
            async function onAuthenticate(event) {
                const obj = JSON.parse(event.data);
                const dto = esbAuthReq.createDto(obj);
                const backUUID = dto.data.backUUID;
                const serverKey = dto.data.serverKey;
                // TODO: refactor authentication
                // await backIdentity.set(backUUID, serverKey);
                const scrambler = await factScrambler.create();
                scrambler.setKeys(serverKey, modIdentity.getSecretKey());
                const msg = esfAuthRes.createDto();
                msg.data.frontId = modIdentity.getFrontBid();
                msg.data.encrypted = scrambler.encryptAndSign(backUUID);
                portalBack.publish(msg);
                logger.info(`Front authentication response is sent to back.`);
            }

            /**
             * Publish 'opened' event on the front.
             * @param {Event} event
             */
            function onError(event) {
                if (event.eventPhase !== EventSource.CLOSED) {
                    logger.error(`Error in 'back-to-front event stream' (event: ${JSON.stringify(event)}).`);
                }
                closeStream();
            }

            /**
             * Listener for regular SSE event from the back.
             * @param {MessageEvent} event
             */
            function onMessage(event) {
                try {
                    const obj = JSON.parse(event.data);
                    const dto = factTransMsg.createDto(obj);
                    const name = dto.meta.name;
                    const uuid = dto.meta.uuid;
                    const backUUID = dto.meta.backUUID;
                    logger.info(`${backUUID} => ${name} (${uuid})`);
                    eventFront.publish(dto);
                } catch (e) {
                    logger.error(e);
                }
            }

            /**
             * Publish 'opened' event on the front.
             * @param {Event} event
             */
            function onOpen(event) {
                eventFront.publish(efOpened.createDto());
                modConn.setOnline();
            }

            // MAIN
            if (
                (navigator.onLine) &&
                ((_source === undefined) || (_source.readyState === SSE_STATE.CLOSED))
            ) {
                const url = `${_url}/${modIdentity.getFrontUuid()}`;
                // open new SSE connection and add event listeners
                _source = new EventSource(url);
                _source.addEventListener('open', onOpen);
                _source.addEventListener('error', onError);
                // on 'message' (repeat backend event emission on the front)
                _source.addEventListener('message', onMessage);
                // Front authentication request is the first event in the stream
                _source.addEventListener(DEF.SHARED.EVENT_AUTHENTICATE, onAuthenticate);
            }
        }

        // INSTANCE METHODS
        this.close = closeStream;
        this.open = openStream;
    }
}
