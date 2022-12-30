/**
 * Events channel (event bus) for backend local events.
 */
// noinspection JSClosureCompilerSyntax
/**
 * @extends TeqFw_Web_Event_Shared_Mod_Channel
 * @implements TeqFw_Web_Event_Shared_Api_Event_Channel
 */
export default class TeqFw_Web_Event_Back_Mod_Channel {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Mod_Channel} */
        const base = spec['TeqFw_Web_Event_Shared_Mod_Channel$$']; // instance

        // MAIN
        Object.assign(this, base); // new base instance for every current instance
    }
}
