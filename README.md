# @teqfw/web-event

TeqFW plugin to use asynchronous requests to backend services in teq-apps.

| CAUTION: TeqFW is an unstable project w/o backward compatibility. Use it at your own risk. |
|--------------------------------------------------------------------------------------------|

This `teq`-plugin contains handlers that process asynchronous requests (with JSON payloads) between frontend & backend.

## Install

```shell
$ npm i @teqfw/web-event --save 
```

## Namespace

This plugin uses `TeqFw_Web_Event` namespace.

## `teqfw.json`

[DTO](src/Back/Dto/Plugin/Desc.mjs) for `@teqfw/web-event` nodes in `teq`-plugins descriptors.

```json
{
  "@teqfw/web-event": {}
}
```

## `./cfg/local.json`

[DTO](src/Back/Dto/Config/Local.mjs) for `@teqfw/web-event` node.

## Backend DB

* `TeqFw_Web_Event_Back_RDb_Schema_Front`: registry for frontends (UUID & public key).
* `TeqFw_Web_Event_Back_RDb_Schema_Queue`: queue for delayed 'back-to-front' messages.

## Frontend DB

* `TeqFw_Web_Event_Front_IDb_Schema_Queue`: queue for delayed 'front-to-back' messages.

## Main es6-modules

### Web server handlers

* `TeqFw_Web_Event_Back_Web_Handler_Front_Register`: register front UUID & public key in backend.
* `TeqFw_Web_Event_Back_Web_Handler_Stream_Open`: open new SSE connection to send event from back to front.
* `TeqFw_Web_Event_Back_Web_Handler_Stream_Activate`: authenticate front to use opened SSE connection.
* `TeqFw_Web_Event_Back_Web_Handler_Direct`: process 'front-to-back' requests.
