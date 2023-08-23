/**
 * Key manager to generate keys, import/export keys, etc.
 * @implements TeqFw_Web_Event_Shared_Api_Crypto_Key_Manager
 */
export default class TeqFw_Web_Event_Front_Mod_Crypto_Key_Manager {
    /**
     * @param {TeqFw_Web_Event_Front_Ext_Nacl.box|function} box
     * @param {TeqFw_Web_Event_Front_Ext_Nacl.secretbox|function} secretBox
     * @param {TeqFw_Web_Event_Front_Ext_Nacl.randomBytes|function} randomBytes
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     * @param {TeqFw_Web_Event_Shared_Dto_Identity_Keys} dtoKeys
     */
    constructor(
        {
            'TeqFw_Web_Event_Front_Ext_Nacl.box': box,
            'TeqFw_Web_Event_Front_Ext_Nacl.secretbox': secretBox,
            'TeqFw_Web_Event_Front_Ext_Nacl.randomBytes': randomBytes,
            TeqFw_Core_Shared_Api_Util_Codec$: util,
            TeqFw_Web_Event_Shared_Dto_Identity_Keys$: dtoKeys,
        }
    ) {
        // INSTANCE METHODS

        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = box.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        };

        this.generateSecretKey = async function () {
            return util.ab2b64(randomBytes(secretBox.keyLength));
        }
    }
}
