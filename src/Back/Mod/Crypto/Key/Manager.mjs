/**
 * Backend implementation of crypto key manager.
 * @namespace TeqFw_Web_Event_Back_Mod_Crypto_Key_Manager
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module

/**
 * @implements TeqFw_Web_Event_Shared_Api_Crypto_Key_IManager
 */
export default class TeqFw_Web_Event_Back_Mod_Crypto_Key_Manager {

    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Identity_Keys} */
        const dtoKeys = spec['TeqFw_Web_Event_Shared_Dto_Identity_Keys$'];
        /** @type {TeqFw_Core_Shared_Api_Util_ICodec} */
        const util = spec['TeqFw_Core_Shared_Api_Util_ICodec$'];

        // INSTANCE METHODS
        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = nacl.box.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        }

        this.generateSecretKey = async function () {
            return util.ab2b64(nacl.randomBytes(nacl.secretbox.keyLength));
        }
    }
}
