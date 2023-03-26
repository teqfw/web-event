/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Event_Shared_Defaults {

    NAME = '@teqfw/web-event'; // plugin's node in 'teqfw.json' & './cfg/local.json'

    // URL prefix for API requests: https://.../door/space/...

    SPACE_DIRECT = 'web-event-direct'; // events stream from front to back (POST)
    SPACE_FRONT_REG = 'web-event-front-reg'; // web events: front registration (POST)
    SPACE_STREAM_ACTIVATE = 'web-event-stream-act'; // web events: activate the reverse stream (POST)
    SPACE_STREAM_OPEN = 'web-event-stream-open'; // web events: open the reverse stream

    SSE_AUTHENTICATE = 'authenticate'; // SSE event name

    constructor() {
        Object.freeze(this);
    }
}
