/**
 * Action to send call request to the back and to wait for response on this request from the back.
 *
 * @namespace TeqFw_Web_Event_Front_Act_Trans_Call
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Front_Act_Trans_Call';

// MODULE'S FUNCS
/**
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {Dev_Front_Defaults} */
    const DEF = spec['Dev_Front_Defaults$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Channel} */
    const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Channel$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Portal_Back} */
    const portalBack = spec['TeqFw_Web_Event_Front_Mod_Portal_Back$'];

    // FUNCS

    /**
     * Result function.
     * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} reqDto
     * @param {TeqFw_Core_Shared_Api_Factory_IDto} respFact
     * @param {number} timeout
     * @returns {Promise<Object>}
     * @memberOf TeqFw_Web_Event_Front_Act_Trans_Call
     */
    function act(reqDto, respFact, {timeout} = {}) {
        return new Promise((resolve, reject) => {
            // VARS
            let idFail, subs, requestUuid;

            // FUNCS
            /**
             * @param {Object} data
             * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans_Response.Dto} meta
             */
            function onResponse({data, meta}) {
                // resolve response for own request only
                if (meta?.requestUuid && (meta?.requestUuid === requestUuid)) {
                    clearTimeout(idFail);
                    eventsFront.unsubscribe(subs);
                    // compose response for call request
                    const res = respFact.createDto(data)
                    resolve(res);
                }
            }

            // MAIN
            // subscribe to response event from front
            subs = eventsFront.subscribe(respFact, onResponse);
            // calculate timeout for a waiting and set reject function
            const timeToWait = (timeout > 0) ? timeout : DEF.TIMEOUT_EVENT_RESPONSE;
            idFail = setTimeout(() => {
                eventsFront.unsubscribe(subs);
                reject('Response timeout.');
            }, timeToWait); // return nothing after timeout
            // create transborder event message using source DTO
            const msg = portalBack.createMessage({data: reqDto});
            msg.meta.expired = new Date((new Date()).getTime() + timeToWait); // now + timeout
            // store outgoing message UUID and publish message to back
            requestUuid = msg.meta.uuid;
            portalBack.publish(msg).then();
        });
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
