/**
 *  Registry for events sessions (browser's tabs on a front-end).
 *  @namespace TeqFw_Web_Event_Back_RDb_Schema_Front_Session
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_RDb_Schema_Front_Session';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/web/event/front/session';

/**
 * @memberOf TeqFw_Web_Event_Back_RDb_Schema_Front_Session
 * @type {Object}
 */
const ATTR = {
    BID: 'bid',
    DATE_CONNECTED: 'date_connected',
    DATE_CREATED: 'date_created',
    FRONT_REF: 'front_ref',
    UUID: 'uuid',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Back_RDb_Schema_Front_Session
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    bid;
    /** @type {Date} */
    date_connected;
    /** @type {Date} */
    date_created;
    /** @type {number} */
    front_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class TeqFw_Web_Event_Back_RDb_Schema_Front_Session {
    /**
     * @param {TeqFw_Web_Event_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            TeqFw_Web_Event_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Back_RDb_Schema_Front_Session.Dto} [data]
         * @return {TeqFw_Web_Event_Back_RDb_Schema_Front_Session.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.bid = castInt(data?.bid);
            res.date_connected = castDate(data?.date_connected);
            res.date_created = castDate(data?.date_created);
            res.front_ref = castInt(data?.front_ref);
            res.uuid = castString(data?.uuid);
            return res;
        }

        /**
         * @return {typeof TeqFw_Web_Event_Back_RDb_Schema_Front_Session.ATTR}
         */
        this.getAttributes = () => ATTR;

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.BID],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
