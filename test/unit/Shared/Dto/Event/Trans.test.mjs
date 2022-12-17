import assert from 'assert';
import {container} from '@teqfw/test';
import {describe, it} from 'mocha';

// SETUP ENV

// GET OBJECT FROM CONTAINER AND RUN TESTS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event_Trans';
/** @type {TeqFw_Web_Event_Shared_Dto_Event_Trans} */
const factory = await container.get(`${NS}$`);

describe('TeqFw_Web_Event_Shared_Dto_Event_Trans', function () {
    it('can inject tested object', async () => {
        assert(typeof factory === 'object');
    });

    it('can create empty event message', async () => {
        const event = factory.createEvent();
        assert.equal(typeof event, 'object');
        // assert.equal(event.namespace, NS);
    });

    it('meta is initialized', async () => {
        const event = factory.createEvent();
        assert.equal(event.meta.name, NS);
    });

});

