/**
 * Events channel (event bus) for frontend local events.
 */
// noinspection JSClosureCompilerSyntax
/**
 * @extends TeqFw_Web_Event_Shared_Mod_Channel
 * @implements TeqFw_Web_Event_Shared_Api_Event_Channel
 */
export default class TeqFw_Web_Event_Front_Mod_Channel {
    /**
     * @param {TeqFw_Web_Event_Shared_Mod_Channel} base -  instance
     */
    constructor(
        {
            TeqFw_Web_Event_Shared_Mod_Channel$$: base,
        }) {
        // MAIN
        Object.assign(this, base); // new base instance for every current instance
    }
}
