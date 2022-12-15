/**
 * Registry for reverse events streams.
 * One backend stream corresponds to one frontend session (tab in a browser).
 *
 * @namespace TeqFw_Web_Event_Back_Mod_Registry_Stream
 */
export default class TeqFw_Web_Event_Back_Mod_Registry_Stream {

    constructor(spec) {
        // DEPS
        /** @type {typeof TeqFw_Web_Event_Back_Enum_Stream_State} */
        const STATE = spec['TeqFw_Web_Event_Back_Enum_Stream_State$'];

        // VARS
        /** @type {Object<string, TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto>} */
        const _store = {}; // internal store for connection objects (stream UUID is the key)
        /** @type {Object<string, TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto>} */
        const _storeByFront = {}; // access stream objects by frontUuid
        /**
         * @deprecated use streamUuid on the front
         * @type {{}}
         * @private
         */
        const _mapSessionToStream = {}; // map to get stream UUID for front session UUID

        // INSTANCE METHODS
        /**
         * Delete connection data from registry.
         * @param {string} streamUuid
         */
        this.delete = function (streamUuid) {
            if (_store[streamUuid]) {
                const frontUUID = _store[streamUuid].frontUuid;
                delete _storeByFront[frontUUID];
                delete _mapSessionToStream[frontUUID];
                delete _store[streamUuid];
            }
        }

        /**
         * Get connection object by stream UUID.
         * @param {string} uuid
         * @param {boolean} [activeOnly]
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto|null}
         */
        this.get = (uuid, activeOnly = true) => {
            let res;
            const found = _store[uuid];
            if (found)
                if (activeOnly === false) res = found;
                else if ((activeOnly === true) && (found.state === STATE.ACTIVE))
                    res = found;
            return res;
        }

        /**
         * Return all active streams.
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto[]}
         */
        this.getAll = () => {
            const res = [];
            /** @type {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto[]} */
            const streams = Object.values(_store);
            for (const one of streams)
                if (one.state === STATE.ACTIVE) res.push(one);

            return res;
        }
        /**
         * Get connection object by front application UUID.
         * @param {string} uuid
         * @param {boolean} [activeOnly]
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto|null}
         */
        this.getByFrontUUID = function (uuid, activeOnly = true) {
            const streamUUID = _storeByFront[uuid]
            return this.get(streamUUID, activeOnly);
        }

        /**
         * Get connection object by front session UUID.
         * @param {string} uuid session UUID
         * @param {boolean} [activeOnly]
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto|null}
         * @deprecated use streamUuid
         */
        this.getBySessionUuid = function (uuid, activeOnly = true) {
            const stream = _mapSessionToStream[uuid]
            return this.get(stream, activeOnly);
        }

        /**
         * Get frontUUID by stream UUID
         * @param {string} streamUUID
         * @return {string}
         */
        this.mapUUIDStreamToFront = function (streamUUID) {
            return _store[streamUUID]?.frontUuid;
        }
        /**
         * Put connection to the registry.
         * @param {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto} stream
         */
        this.put = function (stream) {
            const uuid = stream.uuid;
            if (_store[uuid])
                throw new Error(`Cannot registry reverse stream with duplicated UUID: ${uuid}.`);
            _store[uuid] = stream;
            _storeByFront[stream.frontUuid] = stream;
        }

    }
}
