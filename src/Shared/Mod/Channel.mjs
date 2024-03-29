/**
 * Basic functionality for events channel (front or back).
 *
 * Use it as mixins (inject base as instance in child constructor):
 *   const base = spec['TeqFw_Web_Event_Shared_Mod_Channel$$']; // $$ - instance
 *   Object.assign(this, base);
 *
 * @implements TeqFw_Web_Event_Shared_Api_Event_Channel
 */
export default class TeqFw_Web_Event_Shared_Mod_Channel {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {typeof TeqFw_Web_Event_Shared_Api_Event_Subscription} Subscription
     * @param {TeqFw_Web_Event_Shared_Dto_Event} dtoEvent
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Web_Event_Shared_Mod_Subscription#': Subscription,
            TeqFw_Web_Event_Shared_Dto_Event$: dtoEvent,
        }) {
        // VARS
        /** @type {Object<string, function[]>} */
        const _sinks = {};

        // INSTANCE METHODS

        this.createMessage = function (source) {
            return dtoEvent.createDto(source);
        }

        this.publish = async function (message) {
            const eventName = message?.meta?.name ?? message.data?.constructor?.namespace;
            if (Array.isArray(_sinks[eventName]))
                for (const one of _sinks[eventName])
                    one(message)?.catch(logger.error);
        }

        this.subscribe = function (event, handler) {
            let eventName;
            if ((typeof event === 'string') && event.length) {
                eventName = event;
            } else if (
                (typeof event?.constructor?.name === 'string') &&
                (event.constructor.name.length)
            ) {
                eventName = event.constructor.name;
            } else {
                throw new Error(`Cannot subscribe to events using '${event}'.`);
            }
            if (!_sinks[eventName]) _sinks[eventName] = [];
            _sinks[eventName].push(handler);
            return new Subscription(eventName, handler);
        }

        this.unsubscribe = function (subscription) {
            const name = subscription.getEventName();
            const handler = subscription.getHandler();
            if (Array.isArray(_sinks[name]))
                _sinks[name] = _sinks[name].filter(item => item !== handler);
        }
    }
}
