/**
 * IDB for this plugin.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_IDb';
const IDB_VERSION = 2;
/**
 * Factory to create connector to application level IDB
 * @param spec
 * @return {TeqFw_Web_Front_App_Store_IDB}
 */
export default function (spec) {
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['TeqFw_Web_Front_App_Store_IDB$$']; // new instance
    /** @type {TeqFw_Web_Event_Front_IDb_Schema_Queue} */
    const idbDelayed = spec['TeqFw_Web_Event_Front_IDb_Schema_Queue$'];

    // VARS
    const A_DELAYED = idbDelayed.getAttributes();
    const E_DELAYED = idbDelayed.getName();
    const I_DELAYED = idbDelayed.getIndexes();

    // INNER FUNCTIONS
    /**
     * Factory to pin 'db' in the scope and create function to upgrade DB structure on opening.
     * @param {IDBDatabase} db
     * @return {(function(*): void)|*}
     */
    function fnUpgradeDb(db) {
        // const autoIncrement = true;
        // const multiEntry = true;
        // const unique = true;

        // /event/queue
        if (!db.objectStoreNames.contains(E_DELAYED)) {
            const store = db.createObjectStore(E_DELAYED, {keyPath: A_DELAYED.UUID});
            store.createIndex(I_DELAYED.BY_DATE, A_DELAYED.DATE);
        }

    }

    // MAIN
    idb.init(NS, IDB_VERSION, fnUpgradeDb);

    return idb;
}
