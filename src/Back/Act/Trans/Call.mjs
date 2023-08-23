/**
 * Action to send call request to the front and to wait for response on this request from the front.
 *
 * @namespace TeqFw_Web_Event_Back_Act_Trans_Call
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Back_Act_Trans_Call';

// MODULE'S FUNCS
/**
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
/**
 * @param {Dev_Back_Defaults} DEF
 * @param {TeqFw_Web_Event_Back_Mod_Channel} eventsBack
 * @param {TeqFw_Web_Event_Back_Mod_Portal_Front} portalFront
 */
export default function (
    {
        Dev_Back_Defaults$: DEF,
        TeqFw_Web_Event_Back_Mod_Channel$: eventsBack,
        TeqFw_Web_Event_Back_Mod_Portal_Front$: portalFront,
    }) {
    // FUNCS

    /**
     * Result function.
     * @param {TeqFw_Web_Event_Shared_Dto_Event.Dto} reqDto
     * @param {TeqFw_Core_Shared_Api_Factory_Dto} respFact
     * @param {number} timeout
     * @param {string} sessionUuid
     * @param {string} frontUuid
     * @returns {Promise<Object>}
     * @memberOf TeqFw_Web_Event_Back_Act_Trans_Call
     */
    function act(reqDto, respFact, {timeout, sessionUuid, frontUuid} = {}) {
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
                    eventsBack.unsubscribe(subs);
                    // compose response for call request
                    const res = respFact.createDto(data)
                    resolve(res);
                }
            }

            // MAIN
            // subscribe to response event from front
            subs = eventsBack.subscribe(respFact, onResponse);
            // calculate timeout for a waiting and set reject function
            const timeToWait = (timeout > 0) ? timeout : DEF.TIMEOUT_EVENT_RESPONSE;
            idFail = setTimeout(() => {
                eventsBack.unsubscribe(subs);
                reject('Response timeout.');
            }, timeToWait); // return nothing after timeout
            // create transborder event message using source DTO
            const msg = portalFront.createMessage({data: reqDto});
            /** @type {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} */
            const meta = msg.meta;
            meta.expired = new Date((new Date()).getTime() + timeToWait); // now + timeout
            if (sessionUuid) meta.sessionUuid = sessionUuid;
            if (sessionUuid) meta.frontUuid = frontUuid;
            // store outgoing message UUID and publish message to back
            requestUuid = msg.meta.uuid;
            portalFront.publish(msg).then();
        });
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
