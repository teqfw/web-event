/**
 * Key manager to generate keys, import/export keys, etc.
 * @implements TeqFw_Web_Event_Shared_Api_Crypto_Key_IManager
 */
export default class TeqFw_Web_Event_Front_Mod_Crypto_Key_Manager {
    constructor(spec) {
        // DEPS
        const {box, secretbox, randomBytes} = spec['TeqFw_Web_Event_Front_Ext_Nacl'];
        /** @type {TeqFw_Core_Shared_Api_Util_ICodec} */
        const util = spec['TeqFw_Core_Shared_Api_Util_ICodec$'];
        /** @type {TeqFw_Web_Event_Shared_Dto_Identity_Keys} */
        const dtoKeys = spec['TeqFw_Web_Event_Shared_Dto_Identity_Keys$'];

        // INSTANCE METHODS

        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = box.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        }

        this.generateSecretKey = async function () {
            return util.ab2b64(randomBytes(secretbox.keyLength));
        }
    }
}
