/**
 * Action to open new back-to-front events stream and to authenticate frontend's public key.
 *
 * @namespace TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import {randomUUID} from 'node:crypto';

// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream';
const RECONNECT_TIMEOUT = 500; // browser's reconnect timeout on connection loose
const DISCONNECT_TIMEOUT = 10000; // disconnect stream if not authenticated in 10 sec.
const {
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_OK,
} = H2;

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Web_Event_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Web_Event_Back_Mod_Crypto_Scrambler.Factory} */
    const factScrambler = spec['TeqFw_Web_Event_Shared_Api_Crypto_IScrambler.Factory$']; // interface
    /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
    const modAppUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
    /** @type {TeqFw_Web_Event_Back_Mod_Server_Key} */
    const modServerKey = spec['TeqFw_Web_Event_Back_Mod_Server_Key$'];
    /** @type {TeqFw_Web_Event_Back_Mod_Registry_Stream} */
    const modRegStream = spec['TeqFw_Web_Event_Back_Mod_Registry_Stream$'];
    /** @type {TeqFw_Web_Event_Back_Dto_Reverse_Stream} */
    const dtoStream = spec['TeqFw_Web_Event_Back_Dto_Reverse_Stream$'];
    /** @type {TeqFw_Web_Event_Shared_Dto_Stream_Auth} */
    const dtoAuth = spec['TeqFw_Web_Event_Shared_Dto_Stream_Auth$'];
    /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticate_Request} */
    const esbAuthReq = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticate_Request$'];
    /** @type {TeqFw_Web_Event_Back_Act_Front_ReadByUuid.act|function} */
    const actReadFront = spec['TeqFw_Web_Event_Back_Act_Front_ReadByUuid$'];

    // VARS
    logger.setNamespace(NS);
    /**
     * UUID for this backup instance.
     * @type {string}
     */
    const _backUuid = modAppUuid.get();
    const _keyPub = modServerKey.getPublic();
    const _keySec = modServerKey.getSecret();

    // FUNCS

    /**
     * Result function.
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
     * @param {string} frontUuid
     * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream
     */
    function act(res, frontUuid) {
        // FUNCS

        /**
         * Write headers to SSE stream to start streaming.
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act
         */
        function startStreaming(res) {
            res.writeHead(HTTP_STATUS_OK, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
            });
        }

        /**
         * Create reverse events stream for connected front session.
         *
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @param {string} frontUuid
         * @return {string} stream UUID
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act
         */
        function createStream(res, frontUuid) {
            // VARS
            // generate new UUID for newly established connection and pin it to the scope
            const streamUuid = randomUUID();

            // MAIN
            const stream = dtoStream.createDto();
            stream.uuid = streamUuid;
            stream.frontUuid = frontUuid;
            modRegStream.put(stream);
            logger.info(`New stream '${streamUuid}' is opened for back-to-front events (front: ${frontUuid}).`);
            // set 'write' function to connection, response stream is pinned in closure
            stream.write = function (payload) {
                if (res.writable) {
                    const json = JSON.stringify(payload);
                    res.write(`data: ${json}\n\n`);
                    res.write(`id: ${stream.messageId++}\n`);
                } else {
                    logger.error(`Events reverse stream '${streamUuid}' is not writable.`);
                }
            };
            stream.finalize = () => {
                res.end();
            }
            stream.unauthenticatedCloseId = setTimeout(() => {
                logger.error(`Reverse events stream '${streamUuid}' is not authenticated due timeout and is closed.`);
                res.end();
            }, DISCONNECT_TIMEOUT);
            // remove stream from registry on close
            res.addListener('close', () => {
                modRegStream.delete(streamUuid);
                logger.info(`Back-to-front events stream is closed (front: '${streamUuid}').`);
            });

            res.addListener('error', () => {
                logger.error(`Error in reverse events stream (front: '${streamUuid}'): ${e}`);
            });
            return streamUuid;
        }

        /**
         * Send authentication request to the front. backUuid & streamUuid are payload.
         * @param {string} streamUuid UUID for newly opened stream
         * @param {string} frontUuid UUID for connected front
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act
         */
        async function authenticateStream(streamUuid, frontUuid, res) {

            // FUNCS

            /**
             * @param {string} uuid
             * @returns {Promise<TeqFw_Web_Event_Back_RDb_Schema_Front.Dto>}
             */
            async function readFront(uuid) {
                let res;
                const trx = await conn.startTransaction();
                try {
                    res = await actReadFront({trx, uuid});
                    await trx.commit();
                } catch (e) {
                    logger.error(`Cannot read front '${frontUuid}' to authenticate event stream. Error: ${e?.message}`);
                    await trx.rollback();
                }
                return res;
            }

            // MAIN
            if (res.writable) {
                /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto} */
                const front = await readFront(frontUuid);
                if (front) {
                    // compose encrypted payload
                    const scrambler = await factScrambler.create();
                    try {
                        const pub = front.key_pub;
                        scrambler.setKeys(pub, _keySec);
                        // we should use raw data for authentication (w/o event DTO)
                        const auth = dtoAuth.createDto();
                        auth.backUuid = _backUuid;
                        auth.backKey = _keyPub;
                        auth.streamUuidEnc = scrambler.encryptAndSign(streamUuid);
                        // send to front using SSE
                        const payload = JSON.stringify(auth);
                        res.write(`event: ${DEF.SHARED.SSE_AUTHENTICATE}\n`);
                        res.write(`retry: ${RECONNECT_TIMEOUT}\n`);
                        res.write(`data: ${payload}\n\n`);
                        logger.info(`Authentication request is sent to stream '${streamUuid}' for front '${frontUuid}' from back '${_backUuid}'.`);
                    } catch (e) {
                        // encryption failed
                        logger.error(`Cannot encrypt authentication data for front '${frontUuid}' in stream '${streamUuid}'. Close the stream.`);
                        modRegStream.delete(streamUuid);
                        res.end();
                    }
                } else {
                    // unknown front, close the stream
                    logger.error(`Cannot found front '${frontUuid}' to authenticate stream '${streamUuid}'. Close the stream.`);
                    modRegStream.delete(streamUuid);
                    res.end();
                }
            } else {
                logger.error(`Back-to-front events stream is not writable (${streamUuid}).`);
            }
        }

        // MAIN
        const streamUuid = createStream(res, frontUuid);
        startStreaming(res); // respond with headers only to start events stream
        authenticateStream(streamUuid, frontUuid, res).then();
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
