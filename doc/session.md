# Front-End Sessions

## Terms

* **Front**: the set of resources that are subject to the Same-Origin Policy enforced by web browsers. This includes
  resources such as cookies, local storage, and IndexedDB, among others.
* **Session**:  a separate browser tab that has its own session store, which is separate from the session store of other
  tabs and can be used to store data specific to that tab.
* **Direct Stream**: flow of event messages sent from the front-end to the back-end over the HTTP(S) connection.
* **Reverse Stream**: flow of event messages sent from the back-end to the certain tab of the front-end over the SSE
  connection.

## Identification: Front and Session

### Front Identification

The front-end application (`Ra_Desk_Front_App.init`) generates a UUID and pair of asymmetric key for each front upon
installation (`TeqFw_Web_Event_Front_Mod_Identity_Front.init`):

```js
/** @type {TeqFw_Web_Event_Front_Mod_Identity_Front} */
const modIdFront = spec['TeqFw_Web_Event_Front_Mod_Identity_Front$'];
await modIdFront.init();
```

Front identity is stored in IDB (`TeqFw_Web_Front_Store_Entity_Singleton`):

```json
{
  "key": "@teqfw/web-event/identity",
  "value": {
    "frontBid": 823,
    "frontKeys": {
      "public": "TTj...hk=",
      "secret": "fLi...JI="
    },
    "frontUuid": "61b179eb-fb3d-4ea8-9b9f-33e6c21fb2be"
  }
}
```

`frontBid` is undefined initially. To get `frontBid` front app should register its UUID and public key on the back (
see `TeqFw_Web_Event_Front_Web_Connect_Front_Register.act`) before any other communications with back-end.

Back-end handler for registration requests: `TeqFw_Web_Event_Back_Web_Handler_Front_Register`

### Session Identification

Each time when front-end application starts in a new tab new session UUID is
generated (`TeqFw_Web_Event_Front_Mod_Identity_Session`) if not found in the `sessionStorage`:

```js
function initSession() {
    let res = self.sessionStorage.getItem(KEY);
    if (!res) {
        res = self.crypto.randomUUID();
        self.sessionStorage.setItem(KEY, res);
    }
    return res;
}
```

## Reverse Stream Opening

Front-end app opens SSE connection to back-end upon start (`Ra_Desk_Front_App.init`) or in connection
manager (`Ra_Base_Front_Listen_Connect_Manager`):

```js
/** @type {TeqFw_Web_Event_Front_Web_Connect_Stream_Open.act|function} */
const connReverseOpen = spec['TeqFw_Web_Event_Front_Web_Connect_Stream_Open$'];
await connReverseOpen();
```

URL to open reverse stream:

```text
https://origin/web-event-stream-open/{frontUuid}/{sessUuid}
```

Back-end handler for opening requests: `TeqFw_Web_Event_Back_Web_Handler_Stream_Open`. This handler creates new stream
object (`TeqFw_Web_Event_Back_Dto_Reverse_Stream`) for every SSE connection and registers all streams
in `TeqFw_Web_Event_Back_Mod_Registry_Stream`. The registry provides access to saved streams both by `frontUuid` (to set
of streams) and by `sessionUuid` (to single stream).

## Reverse Stream Activation

The first message from back-end to newly connected front-end is authentication
request (`TeqFw_Web_Event_Back_Web_Handler_Stream_Open_A_Stream.act.authenticateStream`). Back-end sends own UUID and
own public key to the front-end. Additionally, the back-end appends `streamUuid` that is encrypted by this
front-end's `publicKey` stored on back-end (been registered previously):

```json
{
  "backKey": "02S...F4=",
  "backUuid": "59450b54-07e5-4359-bf52-8a649cf56804",
  "streamUuidEnc": "R4c...JNO"
}
```

Front-end gets authentication request, saves back-end public key to session store and decrypts `streamUuid` using own
secret key then sends decrypted `streamUuid` back to the
back-end (`TeqFw_Web_Event_Front_Web_Connect_Stream_Activate.act`):

```json
{
  "frontUuid": "b17619eb-fb3d-4ea8-9b9f-33e21fb26cbe",
  "streamUuid": "2148441e-76a7-4df5-b240-ffcb0e64d4d6"
}
```

Back-end validates `streamUuid` with `TeqFw_Web_Event_Back_Web_Handler_Stream_Activate` handler and activates the stream
to send event messages to the front-end.

## Session expiration

TODO

# Deprecated content

Если фронт находится offline, то все сообщения фронта пишутся в очередь (IDB). При восстановлении соединения с бэком
сообщения из очереди отправляются на бэк. Проблема в том, что все сессии фронта пишут свои сообщения в IDB, а UUID
сессии после восстановления обратного соединения отличается от UUID'а сессии до его обрыва.

Такая же проблема есть и на бэке - бэк сохраняет сообщения с номером сессии/потока в очередь (RDB), а после
восстановления соединения UUID сессии изменяется.


