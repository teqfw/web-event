/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Event_Shared_Defaults {

    EVENT_AUTHENTICATE = 'authenticate'; // SSE event name

    NAME = '@teqfw/web-event'; // plugin's node in 'teqfw.json' & './cfg/local.json'

    // URL prefix for API requests: https://.../door/space/...
    SPACE_AUTH = 'auth'; // space for authentication requests
    SPACE_DIRECT = 'efb'; // events stream from front to back
    SPACE_REVERSE = 'ebf'; // events stream from back to front

    constructor() {
        Object.freeze(this);
    }
}
