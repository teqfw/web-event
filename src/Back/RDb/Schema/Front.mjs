/**
 *  Metadata for '/web/event/front' entity (front apps registry).
 *  @namespace TeqFw_Web_Event_Back_RDb_Schema_Front
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_RDb_Schema_Front';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/web/event/front';

/**
 * @memberOf TeqFw_Web_Event_Back_RDb_Schema_Front
 * @type {Object}
 */
const ATTR = {
    BID: 'bid',
    DATE_AUTHENTICATED: 'date_authenticated',
    DATE_CREATED: 'date_created',
    KEY_PUB: 'key_pub',
    UUID: 'uuid',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Back_RDb_Schema_Front
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    bid;
    /**
     * TODO: do we really need this date - every session has own connection date?
     * @type {Date}
     */
    date_authenticated;
    /** @type {Date} */
    date_created;
    /** @type {string} */
    key_pub;
    /** @type {string} */
    uuid;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class TeqFw_Web_Event_Back_RDb_Schema_Front {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto} [data]
         * @return {TeqFw_Web_Event_Back_RDb_Schema_Front.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.bid = castInt(data?.bid);
            res.date_authenticated = castDate(data?.date_authenticated);
            res.date_created = castDate(data?.date_created);
            res.key_pub = castString(data?.key_pub);
            res.uuid = castString(data?.uuid);
            return res;
        }

        /**
         * @return {typeof TeqFw_Web_Event_Back_RDb_Schema_Front.ATTR}
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
