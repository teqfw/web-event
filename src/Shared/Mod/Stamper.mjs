/**
 * Create & verify stamps for event messages between a pair of addressees (front & back).
 */
export default class TeqFw_Web_Event_Shared_Mod_Stamper {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        // FUNCS
        /**
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} meta event message metadata
         * @return {string} payload to encrypt/verify
         */
        function composePayload(meta) {
            /** @type {Date} */
            const published = castDate(meta.published);
            return `${meta.uuid}${published.getTime()}`;
        }

        // INSTANCE METHODS

        /**
         * Concatenate data for encryption and encrypt it.
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} meta event message metadata
         * @param {TeqFw_Web_Event_Shared_Api_Crypto_Scrambler} scrambler
         * @return {string} stamp (encrypted data)
         */
        this.create = function (meta, scrambler) {
            const plain = composePayload(meta)
            return scrambler.encryptAndSign(plain);
        }

        /**
         * Decrypt stamp and compare with expected data.
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} meta event message metadata
         * @param {TeqFw_Web_Event_Shared_Api_Crypto_Scrambler} scrambler
         * @return {boolean}
         */
        this.verify = function (meta, scrambler) {
            const expect = composePayload(meta);
            const actual = scrambler.decryptAndVerify(meta.stamp);
            return (actual === expect);
        }
    }
}
