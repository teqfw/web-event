/**
 *  Metadata for '/web/event/queue' entity (delayed events registry).
 *  @namespace TeqFw_Web_Event_Back_RDb_Schema_Queue
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_RDb_Schema_Queue';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/web/event/queue';

/**
 * @memberOf TeqFw_Web_Event_Back_RDb_Schema_Queue
 * @type {Object}
 */
const ATTR = {
    FRONT_REF: 'front_ref',
    ID: 'id',
    MESSAGE: 'message',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Back_RDb_Schema_Queue
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    front_ref;
    /** @type {number} */
    id;
    /** @type {string} */
    message;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class TeqFw_Web_Event_Back_RDb_Schema_Queue {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Event_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Back_RDb_Schema_Queue.Dto} [data]
         * @return {TeqFw_Web_Event_Back_RDb_Schema_Queue.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.front_ref = castInt(data?.front_ref);
            res.id = castInt(data?.id);
            res.message = castString(data?.message);
            return res;
        }

        /**
         * @return {typeof TeqFw_Web_Event_Back_RDb_Schema_Queue.ATTR}
         */
        this.getAttributes = () => ATTR;
        
        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.ID],
            Dto
        );
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
