/**
 * Default implementation for event subscription.
 * @implements TeqFw_Web_Event_Shared_Api_Event_Subscription
 */
export default class TeqFw_Web_Event_Shared_Mod_Subscription {
    /**
     * Use this constructor with `new` operator.
     * @param {string} eventName
     * @param {function} handler
     */
    constructor(eventName, handler) {

        this.getEventName = () => eventName;

        this.getHandler = () => handler;
    }
}
