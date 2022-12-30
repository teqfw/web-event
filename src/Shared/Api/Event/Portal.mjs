/**
 * Interface for transborder events portal (gateway to transfer events to "other side").
 * This is documentation only code (not executable).
 *
 * @interface
 */
export default class TeqFw_Web_Event_Shared_Api_Event_Portal {
    /**
     * Create message DTO with metadata corresponded to current channel.
     * @param data
     * @param meta
     * @returns {TeqFw_Web_Event_Shared_Dto_Event.Dto}
     */
    createMessage({data, meta} = {}) {}

    /**
     * Publish message about event and run all event handlers with given payload.
     * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
     * @return {Promise<string>} UUID of the published event
     */
    publish(message) { }

    /**
     * Clean up delayed events in the queue.
     * @returns {Promise<number>} number of deleted events
     */
    async cleanDelayedEvents() {}

    /**
     * Publish delayed events for given recipient.
     * @param {string} uuid UUID for other side (front or back)
     */
    sendDelayedEvents({uuid} = {}) { }


}
