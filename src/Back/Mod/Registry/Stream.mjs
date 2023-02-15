/**
 * Registry for reverse events streams (SSE).
 * One backend stream corresponds to one frontend session (tab in a browser).
 * We have 'front-to-streams' and 'session-to-stream' maps to get streams by front (profile in a browser)
 * or by session (tab in a browser).
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
        /** @type {Object<string, string[]>} */
        const _byFront = {};// access stream objects by frontUuid (profile in a browser)
        /** @type {Object<string, string>} */
        const _bySession = {};// access stream objects by sessionUuid (tab in a browser)

        // INSTANCE METHODS
        /**
         * Delete stream from registry.
         * @param {string} streamUuid
         */
        this.delete = function (streamUuid) {
            if (_store[streamUuid]) {
                // delete front mapping
                const frontUuid = _store[streamUuid].frontUuid;
                if (_byFront[frontUuid]) {
                    const filtered = _byFront[frontUuid].filter(item => item !== streamUuid);
                    if (filtered.length) _byFront[frontUuid] = filtered
                    else delete _byFront[frontUuid];
                }
                // delete session mapping
                const sessionUuid = _store[streamUuid].sessionUuid;
                delete _store[sessionUuid];
                // delete stream data
                delete _store[streamUuid];
            }
        }

        /**
         * Get stream by stream UUID.
         * @param {string} uuid
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto|null}
         */
        this.get = (uuid) => {
            return _store[uuid];
        }

        /**
         * Get active stream (for authenticated fronts) by stream UUID.
         * @param {string} uuid
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto|null}
         */
        this.getActive = (uuid) => {
            let res;
            const found = _store[uuid];
            if (found && (found.state === STATE.ACTIVE))
                res = found;
            return res;
        }

        /**
         * Return all active streams (for authenticated fronts).
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto[]}
         */
        this.getAllActive = () => {
            const res = [];
            /** @type {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto[]} */
            const streams = Object.values(_store);
            for (const one of streams)
                if (one.state === STATE.ACTIVE) res.push(one);
            return res;
        }

        /**
         * Get all active streams by front application UUID.
         * @param {string} uuid
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto[]}
         */
        this.getByFrontUuid = function (uuid) {
            const res = [];
            if (_byFront[uuid]) {
                for (const streamUuid of _byFront[uuid]) {
                    const stream = this.getActive(streamUuid);
                    if (stream) res.push(stream);
                }
            }
            return res;
        }

        /**
         * Get active stream by front session UUID (tab in a browser).
         * @param {string} uuid
         * @return {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto}
         */
        this.getBySessionUuid = function (uuid) {
            if (_bySession[uuid]) return this.getActive(_bySession[uuid]);
            else return null;
        }

        /**
         * Put stream object to the registry.
         * @param {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto} stream
         */
        this.put = function (stream) {
            const uuid = stream.uuid;
            if (_store[uuid])
                throw new Error(`Cannot registry reverse stream with duplicated UUID: ${uuid}.`);
            _store[uuid] = stream;
            // map by frontUuid
            if (!Array.isArray(_byFront[stream.frontUuid])) _byFront[stream.frontUuid] = [];
            _byFront[stream.frontUuid].push(uuid);
            // map by sessionUuid
            if ((_bySession[stream.sessionUuid]) && (_bySession[stream.sessionUuid] !== uuid)) {
                // close 'deprecated' stream
                const old = _store[_bySession[stream.sessionUuid]];
                if (typeof old?.finalize === 'function') old.finalize();
            }
            _bySession[stream.sessionUuid] = uuid;
        }

    }
}
