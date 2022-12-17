/**
 * Interface for events channel.
 * This is documentation only code (not executable).
 *
 * @interface
 */
export default class TeqFw_Web_Event_Shared_Api_Event_Channel {
    /**
     * Publish message about event and run all event handlers with given payload.
     * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} message
     */
    publish(message) { }

    /**
     * Add event listener to the channel.
     * @param {string} eventName
     * @param {function} handler
     * @return {TeqFw_Web_Event_Shared_Api_Event_ISubscription}
     */
    subscribe(eventName, handler) { }

    /**
     * Remove subscription.
     * @param {TeqFw_Web_Event_Shared_Api_Event_ISubscription} subscription
     */
    unsubscribe(subscription) { }
}
