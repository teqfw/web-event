/**
 * Abstraction for event subscription.
 * This is documentation only code (not executable).
 *
 * @interface
 */
export default class TeqFw_Web_Event_Shared_Api_Event_ISubscription {
    /**
     * Subscribed event name.
     * @return {string}
     */
    getEventName() {}

    /**
     * @return {function}
     */
    getHandler() {}
}
