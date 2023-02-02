/**
 * Local event 'Server events stream is opened'.
 * Use it to restore reverse events stream when back is offline.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Event_Msg_Stream_Opened';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Front_Event_Msg_Stream_Opened
 */
class Dto {
    static namespace = NS; // used as event name
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Event_Front_Event_Msg_Stream_Opened {
    constructor() {

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Event_Front_Event_Msg_Stream_Opened.Dto} [data]
         * @returns {TeqFw_Web_Event_Front_Event_Msg_Stream_Opened.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            return res;
        }
    }
}
