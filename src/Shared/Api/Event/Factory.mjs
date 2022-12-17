/**
 * Factory to create event message DTO and to provide meta information for this event.
 *
 * This is documentation only code (not executable).
 *
 * @interface
 */
export default class TeqFw_Web_Event_Shared_Api_Event_Factory {
    /**
     * Builder to parse input 'data' and cast known attributes for data-part of an event message.
     * @param {Object} [data]
     * @returns {Object}
     */
    buildData(data) {}

    /**
     * Builder to parse input 'data' and cast known attributes for meta-part of an event message.
     * @param {Object} [data]
     * @returns {Object}
     */
    buildMeta(data) {}

    /**
     * Parse input 'data' and cast known attributes for whole event message.
     * @param {Object} [data]
     * @returns {Object}
     */
    createEvent(data) {}

    /**
     * Return event name.
     * @returns {string}
     */
    getName() {}
}
