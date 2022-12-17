/**
 * Base structure and factory for transborder event message DTO.
 * @namespace TeqFw_Web_Event_Shared_Dto_Event_Trans
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Trans';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Event_Shared_Dto_Event_Trans
 * @extends TeqFw_Web_Event_Shared_Dto_Event.Dto
 */
class Dto {
    static namespace = NS;
    /** @type {TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta.Dto} */
    meta;
}

/**
 * @implements TeqFw_Web_Event_Shared_Api_Event_Factory
 */
export default class TeqFw_Web_Event_Shared_Dto_Event_Trans {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const factBase = spec['TeqFw_Web_Event_Shared_Dto_Event$$']; // instance
        /** @type {TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta} */
        const factMeta = spec['TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta$'];

        // MAIN
        // factBase.buildData = buildData;
        factBase.buildMeta = factMeta.createDto;
        factBase.getName = () => NS;
        return factBase;
    }
}