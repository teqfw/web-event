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
        /** @type {Object<string, string[]>} */
        const _byFront = {};// access stream objects by frontUuid

        // INSTANCE METHODS
        /**
         * Delete stream from registry.
         * @param {string} streamUuid
         */
        this.delete = function (streamUuid) {
            if (_store[streamUuid]) {
                const frontUuid = _store[streamUuid].frontUuid;
                if (_byFront[frontUuid]) {
                    const filtered = _byFront[frontUuid].filter(item => item !== streamUuid);
                    if (filtered.length) _byFront[frontUuid] = filtered
                    else delete _byFront[frontUuid];
                }
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
         * Put stream object to the registry.
         * @param {TeqFw_Web_Event_Back_Dto_Reverse_Stream.Dto} stream
         */
        this.put = function (stream) {
            const uuid = stream.uuid;
            if (_store[uuid])
                throw new Error(`Cannot registry reverse stream with duplicated UUID: ${uuid}.`);
            _store[uuid] = stream;
            if (!Array.isArray(_byFront[stream.frontUuid])) _byFront[stream.frontUuid] = [];
            _byFront[stream.frontUuid].push(uuid);
        }

    }
}
