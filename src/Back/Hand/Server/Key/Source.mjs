/**
 * Process to distribute server's public key for asymmetric encryption.
 */
export default class TeqFw_Web_Event_Back_Hand_Server_Key_Source {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_Mod_Server_Key} */
        const dsKeys = spec['TeqFw_Web_Back_Mod_Server_Key$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Front_Server_Key_Request} */
        const esfKeyReq = spec['TeqFw_Web_Event_Shared_Event_Front_Server_Key_Request$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Server_Key_Response} */
        const esbRes = spec['TeqFw_Web_Event_Shared_Event_Back_Server_Key_Response$'];

        // MAIN
        eventsBack.subscribe(esfKeyReq.getEventName(), onRequest)

        // FUNCS
        /**
         * @param {TeqFw_Web_Event_Shared_Event_Front_Server_Key_Request.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         */
        async function onRequest({data, meta}) {
            const frontUUID = meta.frontUUID;
            const msg = esbRes.createDto();
            msg.meta.frontUUID = frontUUID;
            msg.data.publicKey = await dsKeys.getPublic();
            portalFront.publish(msg);
        }
    }
}
