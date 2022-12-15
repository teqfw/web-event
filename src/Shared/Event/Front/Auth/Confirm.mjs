/**
 * Authentication confirmation from front (with decrypted streamUuid).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Web_Event_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Date.addMinutes|function} */
        const addMinutes = spec['TeqFw_Core_Shared_Util_Date.addMinutes'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm.Dto} [data]
         * @return {TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm.Dto}
         */
        function createData(data) {
            const res = new Dto();
            //
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Event_Shared_Event_Front_Auth_Confirm.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.meta.expiration = addMinutes(1); // default TTL is 1 min
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
