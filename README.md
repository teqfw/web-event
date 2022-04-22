# @teqfw/web-event

TeqFW plugin to use asynchronous requests to backend services in teq-apps.

| CAUTION: TeqFW is an unstable, fast-growing project w/o backward compatibility. Use it at your own risk. |
| -------------------------------------------------------------------------------------------------------- |

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

* `TeqFw_Web_Event_Back_RDb_Schema_Queue`: queue for delayed 'back-to-front' messages.

## Main es6-modules

* `TeqFw_Web_Event_Back_Mod_Server_Handler_Direct`: web server handler to process 'front-to-back' requests.
