/**
 * Local event 'Server events stream is closed'.
 * Use it to restore reverse events stream when back is offline.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Event_Msg_Stream_Closed';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Front_Event_Msg_Stream_Closed
 */
class Dto {
    static namespace = NS; // used as event name
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Front_Event_Msg_Stream_Closed {
    constructor() {

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Front_Event_Msg_Stream_Closed.Dto} [data]
         * @returns {TeqFw_Web_Event_Front_Event_Msg_Stream_Closed.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            return res;
        }
    }
}
