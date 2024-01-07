/**
 * Module with functions to use in a service worker during the fetch stage.
 */
// MODULE'S IMPORTS

// MODULE'S VARS

// MODULE'S FUNCS
/**
 * Function to detect URLs that always bypass caching for @teqfw/web-event plugin.
 * @param {Request} req
 * @return {boolean}
 */
export function bypassCache(req) {
    const SSE_OPEN = /(.*)(\/web-event-stream-open\/)(.*)/; // GET request to open SSE channel
    return Boolean(req.url.match(SSE_OPEN));
}