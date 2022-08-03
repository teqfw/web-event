/**
 * Process to validate fronts authentication responses.
 *
 * @namespace TeqFw_Web_Event_Back_Listen_Front_Authenticate
 */
export default class TeqFw_Web_Event_Back_Listen_Front_Authenticate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Core_Back_Mod_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_Mod_Event_Bus$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Front_Stream_Reverse_Authenticate_Response} */
        const esfAuthRes = spec['TeqFw_Web_Event_Shared_Event_Front_Stream_Reverse_Authenticate_Response$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticated} */
        const esbAuthenticated = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticated$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Failed} */
        const esbFailed = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Failed$'];
        /** @type {TeqFw_Web_Event_Back_Event_Front_Authenticated} */
        const ebFrontAuthenticated = spec['TeqFw_Web_Event_Back_Event_Front_Authenticated$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Auth_Back_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Auth_Back_RDb_Schema_Front$'];
        /** @type {TeqFw_Web_Auth_Back_Mod_Server_Key} */
        const modServerKey = spec['TeqFw_Web_Auth_Back_Mod_Server_Key$'];
        /** @type {TeqFw_Web_Auth_Back_Mod_Crypto_Scrambler.Factory} */
        const factScrambler = spec['TeqFw_Web_Auth_Back_Mod_Crypto_Scrambler.Factory$'];
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const backUUID = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Reverse_Registry} */
        const modRegistry = spec['TeqFw_Web_Event_Back_Mod_Reverse_Registry$'];
        /** @type {typeof TeqFw_Web_Event_Back_Enum_Stream_State} */
        const STATE = spec['TeqFw_Web_Event_Back_Enum_Stream_State$'];

        // MAIN
        eventsBack.subscribe(esfAuthRes.getEventName(), onResponse);

        // FUNCS
        /**
         * @param {TeqFw_Web_Event_Shared_Event_Front_Stream_Reverse_Authenticate_Response.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         */
        async function onResponse({data, meta}) {
            // FUNCS
            /**
             * Get front public key by id from RDB.
             * @param {number} frontId
             * @return {Promise<string>}
             */
            async function getFrontKey(frontId) {
                let res;
                const trx = await conn.startTransaction();
                try {
                    /** @type {TeqFw_Web_Auth_Back_RDb_Schema_Front.Dto} */
                    const one = await crud.readOne(trx, rdbFront, frontId);
                    await trx.commit();
                    res = one?.key_pub;
                } catch (e) {
                    logger.error(e?.message);
                    await trx.rollback();
                }
                return res;
            }

            // MAIN
            const frontUuid = meta.frontUUID;
            const encrypted = data.encrypted;
            if (encrypted) {
                const stream = modRegistry.getByFrontUUID(frontUuid, false);
                if (stream) {
                    const frontPublic = await getFrontKey(data?.frontId);
                    const serverSecret = await modServerKey.getSecret();
                    const scrambler = await factScrambler.create();
                    try {
                        scrambler.setKeys(frontPublic, serverSecret);
                        const decrypted = scrambler.decryptAndVerify(encrypted);
                        if (decrypted === backUUID.get()) {
                            // activate stream and send 'authenticated' event to connected front
                            stream.state = STATE.ACTIVE
                            clearTimeout(stream.unauthenticatedCloseId);
                            const event = esbAuthenticated.createDto();
                            event.meta.frontUUID = frontUuid;
                            portalFront.publish(event);
                            // re-publish delayed events
                            portalFront.sendDelayedEvents(data.frontId, frontUuid);
                            // publish local event about front authentication
                            const dtoAuth = ebFrontAuthenticated.createDto();
                            dtoAuth.data.frontId = data.frontId;
                            dtoAuth.data.frontUuid = frontUuid;
                            eventsBack.publish(dtoAuth);
                        } // impossible situation: payload is decrypted but wrong
                    } catch (e) {
                        const msg = `Cannot authenticate front, payload decryption is failed.`;
                        logger.error(msg);
                        const event = esbFailed.createDto();
                        event.data.reason = msg;
                        event.meta.frontUUID = frontUuid;
                        portalFront.publish(event, {useUnAuthStream: true});
                    }
                } // else: requested front is not in the streams registry, do nothing
            } // else: encrypted data is absent, do nothing
        }
    }
}
