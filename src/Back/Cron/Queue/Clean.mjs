/**
 * Clean up expired events in transborder events queue.
 */
// MODULE'S VARS
const TIMEOUT_LOOP = 300000; // launch clean up every 5 min (300 sec)

// MODULE'S CLASSES
export default class TeqFw_Web_Event_Back_Cron_Queue_Clean {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Event_Back_Mod_Portal_Front} portalFront
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Event_Back_Mod_Portal_Front$: portalFront,
        }) {
        // VARS
        logger.setNamespace(this.constructor.name);
        let _idTimeout;

        // FUNCS

        async function iteration() {
            try {
                const num = await portalFront.cleanDelayedEvents();
                if (num)
                    logger.info(`Total '${num} events are deleted from queue.`);
                // setup next iteration
                _idTimeout = setTimeout(iteration, TIMEOUT_LOOP);
            } catch (e) {
                logger.error(`Cron iteration for delayed events cleaner is failed, iterations are aborted. Error: ${e?.message}`);
            }
        }

        // INSTANCE METHODS

        /**
         * Start events generation.
         * @returns {Promise<void>}
         */
        this.start = async function () {
            _idTimeout = setTimeout(iteration, TIMEOUT_LOOP);
            logger.info(`The clean up of transborder events queue is started.`);
        }

        /**
         * Clear timeout and stop events generation.
         */
        this.stop = function () {
            if (_idTimeout) {
                clearTimeout(_idTimeout);
                logger.info(`The clean up of transborder events queue is stopped.`);
            }
        }
    }
}
