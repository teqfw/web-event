/**
 * Queue for 'front-to-back' delayed events.
 *
 * @namespace TeqFw_Web_Event_Front_IDb_Schema_Queue
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_IDb_Schema_Queue';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/queue';

/**
 * @memberOf TeqFw_Web_Event_Front_IDb_Schema_Queue
 * @type {Object}
 */
const ATTR = {
    DATE: 'meta.published',
    UUID: 'meta.uuid',
};

/**
 * @memberOf TeqFw_Web_Event_Front_IDb_Schema_Queue
 */
const INDEX = {
    BY_DATE: 'by_date'
}

/**
 * @memberOf TeqFw_Web_Event_Front_IDb_Schema_Queue
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class TeqFw_Web_Event_Front_IDb_Schema_Queue {

    constructor() {

        /**
         * @param {TeqFw_Web_Event_Front_IDb_Schema_Queue.Dto} [data]
         * @return {TeqFw_Web_Event_Front_IDb_Schema_Queue.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            return res;
        }
    }

    /**
     * @return {typeof TeqFw_Web_Event_Front_IDb_Schema_Queue.ATTR}
     */
    getAttributes = () => ATTR;

    getAttrNames = () => Object.values(ATTR);

    getEntityName = () => ENTITY;

    /**
     * @return {typeof TeqFw_Web_Event_Front_IDb_Schema_Queue.INDEX}
     */
    getIndexes = () => INDEX;

    getPrimaryKey = () => [ATTR.UUID];

    getKeysForIndex(index) {
        if (index === INDEX.BY_DATE) return [ATTR.DATE];
        // else if (index === INDEX.BY_UUID) return [ATTR.UUID];
        return this.getPrimaryKey();
    }
}
