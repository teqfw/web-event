import assert from 'assert';
import {container} from '@teqfw/test';
import {describe, it} from 'mocha';

// SETUP ENV

// GET OBJECT FROM CONTAINER AND RUN TESTS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta';
/** @type {TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta} */
const factory = await container.get(`${NS}$`);

describe('TeqFw_Web_Event_Shared_Dto_Event_Trans_Meta', function () {
    it('can inject tested object', async () => {
        assert(typeof factory === 'object');
    });

    it('can create empty DTO', async () => {
        const dto = factory.createDto();
        assert(typeof dto === 'object');
        assert.equal(dto.constructor.namespace, NS);
    });

});

