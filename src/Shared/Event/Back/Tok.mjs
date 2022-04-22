/**
 * One 'tok' is performed on the back.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Event_Back_Tok';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Event_Back_Tok
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    timeout;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Event_Shared_Event_Back_Tok {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {TeqFw_Web_Event_Shared_Event_Back_Tok.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Event_Back_Tok.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.timeout = castInt(data?.timeout);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: TeqFw_Web_Event_Shared_Event_Back_Tok.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Event_Shared_Event_Back_Tok.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
