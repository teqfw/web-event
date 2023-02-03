/**
 * Interface for events channel (event bus).
 * This is documentation only code (not executable).
 *
 * @interface
 */
export default class TeqFw_Web_Event_Shared_Api_Event_Channel {
    /**
     * Create message DTO with meta-data corresponded to current channel.
     * @param {TeqFw_Web_Event_Shared_Dto_Event} source
     * @returns {TeqFw_Web_Event_Shared_Dto_Event.Dto}
     */
    createMessage(source) {}

    /**
     * Publish message about event and run all event handlers with given payload.
     * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
     */
    publish(message) { }

    /**
     * Add event listener to the channel.
     * @param {Class|string} event Event DTO factory or event's name
     * @param {function} handler
     * @return {TeqFw_Web_Event_Shared_Api_Event_Subscription}
     */
    subscribe(event, handler) { }

    /**
     * Remove subscription.
     * @param {TeqFw_Web_Event_Shared_Api_Event_Subscription} subscription
     */
    unsubscribe(subscription) { }
}
