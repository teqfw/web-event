/**
 * Backend implementation of crypto key manager.
 * @namespace TeqFw_Web_Event_Back_Mod_Crypto_Key_Manager
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module

/**
 * @implements TeqFw_Web_Event_Shared_Api_Crypto_Key_Manager
 */
export default class TeqFw_Web_Event_Back_Mod_Crypto_Key_Manager {
    /**
     * @param {TeqFw_Web_Event_Shared_Dto_Identity_Keys} dtoKeys
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     */

    constructor(
        {
            TeqFw_Web_Event_Shared_Dto_Identity_Keys$: dtoKeys,
            TeqFw_Core_Shared_Api_Util_Codec$: util,
        }) {
        // INSTANCE METHODS
        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = nacl.box.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        };

        this.generateSecretKey = async function () {
            return util.ab2b64(nacl.randomBytes(nacl.secretbox.keyLength));
        }
    }
}
