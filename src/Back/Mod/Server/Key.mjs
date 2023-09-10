/**
 * Source to get server keys for asymmetric encryption from file.
 *
 * @namespace TeqFw_Web_Event_Back_Mod_Server_Key
 */
// MODULE'S IMPORT
import {join} from 'node:path';
import {existsSync, writeFileSync} from 'node:fs';

// MODULE'S CLASSES
export default class TeqFw_Web_Event_Back_Mod_Server_Key {
    /**
     * @param {TeqFw_Web_Event_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Back_Util.readJson|function} readJson
     * @param {TeqFw_Web_Event_Shared_Api_Crypto_Key_Manager} mgrKey
     */
    constructor(
        {
            TeqFw_Web_Event_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Config$: config,
            'TeqFw_Core_Back_Util.readJson': readJson,
            TeqFw_Web_Event_Shared_Api_Crypto_Key_Manager$: mgrKey,
        }) {
        // VARS
        /** @type {TeqFw_Web_Event_Shared_Dto_Identity_Keys.Dto} */
        let _keys;

        // INSTANCE METHODS

        /**
         * @return {string}
         */
        this.getPublic = function () {
            return _keys.public;
        }

        /**
         * @return {string}
         */
        this.getSecret = function () {
            return _keys.secret;
        }

        /**
         * Load server's keys from the file or generate new ones.
         */
        this.init = async function () {
            const root = config.getPathToRoot();
            const path = join(root, DEF.FILE_CRYPTO_KEYS);
            if (!(existsSync(path))) {
                _keys = await mgrKey.generateAsyncKeys();
                const data = JSON.stringify(_keys);
                writeFileSync(path, data);
                logger.info(`New crypto keys for web events are stored in '${path}'.`);
            } else {
                _keys = readJson(path);
                logger.info(`Crypto keys for web events are loaded from '${path}'.`);
            }
        }
    }
}
