/**
 * Connector to send GET request to open reverse events stream (SSE).
 * It uses SSE state model to reflect changes in connection state.
 * Connection uses frontUuid to connect to backend and saves streamUuid, backendUuid and backend public key
 * to session store when connected.
 *
 * @namespace TeqFw_Web_Event_Front_Web_Connect_Stream_Open
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Web_Connect_Stream_Open';
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/readyState
 */
const SSE_STATE = {
    CLOSED: 2,
    CONNECTING: 0,
    OPEN: 1,
};

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Web_Event_Front_Defaults} */
    const DEF = spec['TeqFw_Web_Event_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Event_Front_Mod_Channel} */
    const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Channel$'];
    /** @type {TeqFw_Web_Event_Front_Event_Msg_Stream_Closed} */
    const efClosed = spec['TeqFw_Web_Event_Front_Event_Msg_Stream_Closed$'];
    /** @type {TeqFw_Web_Event_Front_Event_Msg_Stream_Opened} */
    const efOpened = spec['TeqFw_Web_Event_Front_Event_Msg_Stream_Opened$'];
    /** @type {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} */
    const modConn = spec['TeqFw_Web_Front_Api_Mod_Server_Connect_IState$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Identity_Front} */
    const modIdFront = spec['TeqFw_Web_Event_Front_Mod_Identity_Front$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Identity_Back} */
    const modIdBack = spec['TeqFw_Web_Event_Front_Mod_Identity_Back$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Identity_Session} */
    const modIdSess = spec['TeqFw_Web_Event_Front_Mod_Identity_Session$'];
    /** @type {TeqFw_Web_Event_Shared_Mod_Stamper} */
    const modStamper = spec['TeqFw_Web_Event_Shared_Mod_Stamper$'];
    /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
    const dtoTransMsg = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
    /** @type {TeqFw_Web_Event_Shared_Dto_Stream_Auth} */
    const dtoAuth = spec['TeqFw_Web_Event_Shared_Dto_Stream_Auth$'];
    /** @type {TeqFw_Web_Event_Front_Dto_Identity_Back} */
    const dtoIdBack = spec['TeqFw_Web_Event_Front_Dto_Identity_Back$'];
    /** @type {TeqFw_Web_Event_Front_Web_Connect_Stream_Activate.act|function} */
    const connActivate = spec['TeqFw_Web_Event_Front_Web_Connect_Stream_Activate$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Crypto_Scrambler.Factory} */
    const factScrambler = spec['TeqFw_Web_Event_Front_Mod_Crypto_Scrambler.Factory$'];

    // VARS
    logger.setNamespace(NS);
    /** @type {EventSource} */
    let _source;
    let _url = `./${DEF.SHARED.SPACE_STREAM_OPEN}`;

    // FUNCS
    function closeStream() {
        //close SSL connection if not closed
        if (_source && (_source.readyState !== SSE_STATE.CLOSED)) {
            _source.close();
            logger.info(`Reverse events stream connection is closed.`);
        }
        // generate local event
        /** @type {TeqFw_Web_Event_Shared_Dto_Event.Dto} */
        const msg = eventsFront.createMessage();
        msg.data = efClosed.createDto();
        eventsFront.publish(msg)
            .then(modConn.setOffline); // update connection state
    }

    /**
     * Open SSE connection and set handlers for input data.
     * @memberOf TeqFw_Web_Event_Front_Web_Connect_Stream_Open
     */
    function act() {
        return new Promise((resolve, reject) => {
            // FUNCS
            /**
             * Listener for SSE authentication event from the back.
             * Decrypt and verify authentication payload. Save stream UUID to local storage. Return confirmation to back.
             * @param {MessageEvent} event
             * @memberOf TeqFw_Web_Event_Front_Web_Connect_Stream_Open.act
             */
            async function onAuthenticate(event) {
                /** @type {TeqFw_Web_Event_Shared_Dto_Stream_Auth.Dto} */
                const dataAuth = dtoAuth.createDto(JSON.parse(event?.data));
                // decrypt payload and extract back & stream UUIDs
                const pub = dataAuth.backKey;
                const sec = modIdFront.getSecretKey();
                const scrambler = await factScrambler.create();
                scrambler.setKeys(pub, sec);
                const streamUuid = scrambler.decryptAndVerify(dataAuth.streamUuidEnc);
                // compose backend identity
                const dataIdBack = dtoIdBack.createDto();
                dataIdBack.backKey = dataAuth.backKey;
                dataIdBack.backUuid = dataAuth.backUuid;
                dataIdBack.streamUuid = streamUuid;
                modIdBack.set(dataIdBack);
                modIdSess.setIdBack(dataIdBack);
                // publish confirmation to back
                connActivate(modIdFront.getFrontUuid(), streamUuid);
                logger.info(`Front authentication response is sent to back.`);
                resolve();
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
                reject();
            }

            /**
             * Listener for regular SSE event from the back.
             * Validates stamp of incoming message or decrypt incoming data.
             *
             * @param {MessageEvent} event
             */
            async function onMessage(event) {
                // FUNCS
                /**
                 * Log incoming message and publish it in local channel.
                 * @param {Object} data
                 * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} meta
                 */
                function publish({data, meta}) {
                    const name = meta.name;
                    const uuid = meta.uuid;
                    const backUuid = meta.backUuid;
                    logger.info(`${name} (${uuid}): ${backUuid} => ${meta?.sessionUuid}/${modIdFront.getFrontUuid()}`);
                    eventsFront.publish({data, meta}).then();
                }

                // MAIN
                try {
                    const obj = JSON.parse(event.data);
                    /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
                    const meta = obj.meta;
                    if (meta.encrypted) {
                        // decrypt and verify all data
                        const scrambler = await factScrambler.create();
                        scrambler.setKeys(modIdSess.getBackKey(), modIdFront.getSecretKey());
                        const decrypted = scrambler.decryptAndVerify(obj.data);
                        obj.data = JSON.parse(decrypted);
                        const dto = dtoTransMsg.createDto(obj);
                        publish(dto);
                    } else {
                        // decrypt and verify stamp only
                        const dto = dtoTransMsg.createDto(obj);
                        modStamper.initKeys(modIdSess.getBackKey(), modIdFront.getSecretKey());
                        if (modStamper.verify(dto.meta)) {
                            publish(dto);
                        } else logger.error(`Wrong stamp for message '${dto.meta.name}' (uuid: ${dto.meta.uuid}).`);
                    }
                } catch (e) {
                    logger.error(e);
                }
            }

            /**
             * Publish 'opened' event on the front.
             * @param {Event} event
             */
            function onOpen(event) {
                /** @type {TeqFw_Web_Event_Shared_Dto_Event.Dto} */
                const msg = eventsFront.createMessage();
                msg.data = efOpened.createDto();
                msg.meta.name = msg.data.constructor.namespace;
                eventsFront.publish(msg)
                    .then(modConn.setOnline);
            }

            // MAIN
            if (
                (navigator.onLine) &&
                ((_source === undefined) || (_source.readyState === SSE_STATE.CLOSED))
            ) {
                // compose URL with front identifier to log requests
                const frontUuid = modIdFront.getFrontUuid();
                const sessionUuid = modIdSess.getSessionUuid();
                const url = `${_url}/${frontUuid}/${sessionUuid}`;

                // open new SSE connection and add event listeners
                _source = new EventSource(url);
                _source.addEventListener('open', onOpen);
                _source.addEventListener('error', onError);
                // on 'message' (repeat backend event emission on the front)
                _source.addEventListener('message', onMessage);
                // Auth authentication request is the first SSE event in the stream
                _source.addEventListener(DEF.SHARED.SSE_AUTHENTICATE, onAuthenticate);
            } else resolve(); // work offline
        });

    }

    Object.defineProperty(act, 'namespace', {value: NS});

    // MAIN
    window.addEventListener('offline', closeStream);
    window.addEventListener('online', act);
    return act;
}
