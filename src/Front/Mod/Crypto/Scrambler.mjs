/**
 * Frontend implementation for scrambler (encrypt/decrypt object for strings).
 *
 * @namespace TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler
 * @implements TeqFw_Web_Auth_Shared_Api_Crypto_IScrambler
 */
export default class TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Auth_Front_Lib_Nacl.box} */
        const box = spec['TeqFw_Web_Auth_Front_Lib_Nacl.box'];
        /** @type {TeqFw_Web_Auth_Front_Lib_Nacl.randomBytes|function} */
        const randomBytes = spec['TeqFw_Web_Auth_Front_Lib_Nacl.randomBytes'];
        /** @type {TeqFw_Core_Shared_Api_Util_ICodec} */
        const util = spec['TeqFw_Core_Shared_Api_Util_ICodec$'];

        // VARS
        let _keyShared;

        // INSTANCE METHODS
        this.decryptAndVerify = function (encrypted) {
            let res = null;
            const messageWithNonceAsUint8Array = util.b642ab(encrypted);
            const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
            const message = messageWithNonceAsUint8Array.slice(
                box.nonceLength,
                encrypted.length
            );
            const decryptedAb = box.open.after(message, nonce, _keyShared);
            if (decryptedAb) {
                const jsonStr = util.ab2utf(decryptedAb);
                res = JSON.parse(jsonStr);
            }
            return res;
        }

        this.encryptAndSign = function (plain) {
            const messageUint8 = util.utf2ab(JSON.stringify(plain));
            const nonce = randomBytes(box.nonceLength);
            const encrypted = box.after(messageUint8, nonce, _keyShared);
            const fullMessage = new Uint8Array(nonce.length + encrypted.length);
            fullMessage.set(nonce);
            fullMessage.set(encrypted, nonce.length);
            return util.ab2b64(fullMessage);
        }

        this.setKeys = function (pub, sec) {
            const abPub = util.b642ab(pub);
            const abSec = util.b642ab(sec);
            _keyShared = box.before(abPub, abSec);
        }
    }
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IAsync
 * @memberOf TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler
 */
export class Factory {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];

        // INSTANCE METHODS
        /**
         *
         * @param [opts]
         * @return {Promise<TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler>}
         */
        this.create = async function (opts) {
            // return new instance
            return container.get('TeqFw_Web_Auth_Front_Mod_Crypto_Scrambler$$');
        }
    }
}
