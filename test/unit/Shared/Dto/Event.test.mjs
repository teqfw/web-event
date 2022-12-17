import assert from 'assert';
import {container} from '@teqfw/test';
import {describe, it} from 'mocha';

// SETUP ENV

// GET OBJECT FROM CONTAINER AND RUN TESTS
const NS = 'TeqFw_Web_Event_Shared_Dto_Event';
/** @type {TeqFw_Web_Event_Shared_Dto_Event} */
const factory = await container.get(`${NS}$`);

describe('TeqFw_Web_Event_Shared_Dto_Event', function () {
    it('can inject tested object', async () => {
        assert.equal(typeof factory, 'object');
    });

    it('can create empty event message', async () => {
        const event = factory.createEvent();
        assert.equal(typeof event, 'object');
        assert.equal(event.constructor.namespace, NS);
    });

    it('meta is initialized', async () => {
        const dto = factory.createEvent();
        assert.equal(dto.meta.name, NS);
        assert.equal(typeof dto.meta.uuid, 'string');
        assert(dto.meta.published instanceof Date);
    });

    it('can parse input data', async () => {
        const event = factory.createEvent({data: {id: 4, name: 'John Doe'}});
        assert.equal(event?.data?.id, 4);
        assert.equal(event?.data?.name, 'John Doe');
    });

});

