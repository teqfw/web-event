/**
 * Action to open new back-to-front events stream and to authenticate front-end's public key.
 *
 * @namespace TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import {randomUUID} from 'node:crypto';

// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream';
const RECONNECT_TIMEOUT = 0; // browser's reconnect timeout (ms) on connection loose (reconnect in custom manager)
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
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Web_Event_Back_Mod_Crypto_Scrambler.Factory} */
    const factScrambler = spec['TeqFw_Web_Event_Shared_Api_Crypto_Scrambler.Factory$']; // interface
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
    /** @type {TeqFw_Web_Event_Back_Act_Front_ReadByUuid.act|function} */
    const actReadFront = spec['TeqFw_Web_Event_Back_Act_Front_ReadByUuid$'];
    /** @type {TeqFw_Web_Back_App_Server_Respond.respond404|function} */
    const respond404 = spec['TeqFw_Web_Back_App_Server_Respond.respond404'];

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
     * @param {string} frontUuid profile in a browser (IDB, ...)
     * @param {string} sessionUuid tab in a browser (Session Store)
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream
     */
    async function act(res, frontUuid, sessionUuid) {
        // FUNCS

        /**
         * Read front data from RDB by front UUID (public key).
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
                logger.error(`Cannot found front '${frontUuid}' in RDB on SSE stream opening. Error: ${e?.message}`);
                await trx.rollback();
            }
            return res;
        }

        /**
         * Send authentication request to the front. backUuid & streamUuid are payload.
         * @param {string} streamUuid UUID for newly opened stream
         * @param {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto} front front data from RDB
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act
         */
        async function authenticateStream(streamUuid, front, res) {
            if (res.writable) {
                // update frontBid in the stream
                const stream = modRegStream.get(streamUuid);
                stream.frontBid = front.bid;
                try {
                    // create scrambler for the stream
                    stream.scrambler = await factScrambler.create();
                    const pub = front.key_pub;
                    stream.scrambler.setKeys(pub, _keySec);
                    // we should use raw data for authentication (w/o event DTO)
                    const auth = dtoAuth.createDto();
                    auth.backUuid = _backUuid;
                    auth.backKey = _keyPub;
                    auth.streamUuidEnc = stream.scrambler.encryptAndSign(streamUuid);
                    // send to front using SSE
                    const payload = JSON.stringify(auth);
                    res.write(`event: ${DEF.SHARED.SSE_AUTHENTICATE}\n`);
                    res.write(`retry: ${RECONNECT_TIMEOUT}\n`);
                    res.write(`data: ${payload}\n\n`);
                    logger.info(`Authentication request is sent to stream ${streamUuid} for `
                        + `front '${front.uuid}/${stream.sessionUuid}' from back '${_backUuid}'.`);
                } catch (e) {
                    // encryption failed
                    logger.error(`Cannot encrypt authentication data for front '${front.uuid}' `
                        + `in stream ${streamUuid}. Close the stream.`);
                    modRegStream.delete(streamUuid);
                    res.end();
                }
            } else {
                logger.error(`Back-to-front events stream is not writable (${streamUuid}).`);
            }
        }

        /**
         * Create reverse events stream object for given front & session.
         *
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @param {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto} front front data from RDB
         * @param {string} sessionUuid tab in a browser (Session Store)
         * @return {string} stream UUID
         * @memberOf TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act
         */
        function createStream(res, front, sessionUuid) {
            // VARS
            // generate new UUID for newly established connection and pin it to the scope
            const streamUuid = randomUUID();

            // MAIN
            const stream = dtoStream.createDto();
            stream.frontBid = front.bid;
            stream.frontUuid = front.uuid;
            stream.sessionUuid = sessionUuid;
            stream.uuid = streamUuid;
            modRegStream.put(stream);
            const fid = `${front.uuid}/${sessionUuid}`;
            logger.info(`New stream ${streamUuid} is opened for back-to-front events (front: ${fid}).`);
            // set 'write' function to connection, response stream is pinned in closure
            stream.write = function (payload) {
                if (res.writable) {
                    const json = JSON.stringify(payload);
                    res.write(`data: ${json}\n\n`);
                    res.write(`id: ${stream.messageId++}\n`);
                    return true;
                } else {
                    logger.error(`Events reverse stream ${streamUuid} is not writable.`);
                    return false;
                }
            };
            stream.finalize = () => {
                res.end();
            }
            stream.unauthenticatedCloseId = setTimeout(() => {
                logger.error(`Reverse events stream ${streamUuid} is not authenticated due timeout and is closed.`);
                res.end();
            }, DISCONNECT_TIMEOUT);
            // remove stream from registry on close
            res.addListener('close', () => {
                modRegStream.delete(streamUuid);
                logger.info(`Back-to-front events stream is closed (stream: ${streamUuid}, front: ${fid}).`);
            });
            // log stream errors
            res.addListener('error', (e) => {
                logger.error(`Error in reverse events stream (stream: ${streamUuid}, front: ${fid}): ${e}`);
            });
            logger.info(`New reverse event stream ${streamUuid} is created for front ${fid}.`);
            return streamUuid;
        }

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

        // MAIN

        const front = await readFront(frontUuid);
        if (front) {
            const streamUuid = createStream(res, front, sessionUuid);
            startStreaming(res); // respond with headers only to start events stream
            authenticateStream(streamUuid, front, res).then();
        } else {
            const msg = `SSE connection error: front '${frontUuid}' is not registered and cannot be authenticated.`;
            logger.error(msg);
            respond404(res, msg);
        }
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
