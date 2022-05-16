# chubbyjs-framework

[![CI](https://github.com/chubbyjs/chubbyjs-framework/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyjs/chubbyjs-framework/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyjs/chubbyjs-framework/badge.svg?branch=master)](https://coveralls.io/github/chubbyjs/chubbyjs-framework?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyjs/chubbyjs-framework/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyjs/chubbyjs-framework/master)
[![npm-version](https://img.shields.io/npm/v/@chubbyjs/chubbyjs-framework.svg)](https://www.npmjs.com/package/@chubbyjs/chubbyjs-framework)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)

## Description

A minimal, highly [performant][2] middleware [PSR-15][3] microframework built with as little complexity as possible, aimed primarily at those developers who want to understand all the vendors they use.

## Requirements

 * node: 12
 * [@chubbyjs/psr-container][4]: ^1.0.0
 * [@chubbyjs/psr-http-factory][5]: ^1.1.0
 * [@chubbyjs/psr-http-message][6]: ^1.2.1
 * [@chubbyjs/psr-http-server-handler][7]: ^1.1.1
 * [@chubbyjs/psr-http-server-middleware][8]: ^1.1.1
 * [@chubbyjs/psr-log][9]: ^1.0.3

## Suggest

### Http-Message

 * [@chubbyjs/chubbyjs-http-message][10]: ^1.1.1

### Router

 * [@chubbyjs/chubbyjs-framework-router-path-to-regexp][11]: ^1.0.1

### Server

 * [@chubbyjs/chubbyjs-node-psr-http-message-bridge][12]: ^1.2.3
 * [@chubbyjs/chubbyjs-uwebsockets-psr-http-message-bridge][13]: ^1.1.1

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyjs/chubbyjs-framework][1].

```sh
npm i @chubbyjs/chubbyjs-framework@1.2.0 \
    @chubbyjs/chubbyjs-framework-router-path-to-regexp@1.0.1 \
    @chubbyjs/chubbyjs-http-message@1.1.1
```

## Usage

### App

```ts
import PathToRegexpRouteMatcher from '@chubbyjs/chubbyjs-framework-router-path-to-regexp/dist/PathToRegexpRouteMatcher';
import Application from '@chubbyjs/chubbyjs-framework/dist/Application';
import ErrorMiddleware from '@chubbyjs/chubbyjs-framework/dist/Middleware/ErrorMiddleware';
import RouteMatcherMiddleware from '@chubbyjs/chubbyjs-framework/dist/Middleware/RouteMatcherMiddleware';
import CallbackRequestHandler from '@chubbyjs/chubbyjs-framework/dist/RequestHandler/CallbackRequestHandler';
import Route from '@chubbyjs/chubbyjs-framework/dist/Router/Route';
import Routes from '@chubbyjs/chubbyjs-framework/dist/Router/Routes';
import ResponseFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/ResponseFactory';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';

const responseFactory = new ResponseFactory();

const app = new Application([
    new ErrorMiddleware(responseFactory, true),
    new RouteMatcherMiddleware(
        new PathToRegexpRouteMatcher(new Routes([
            Route.get('/hello/:name([a-z]+)', 'hello', new CallbackRequestHandler(
                async (request: ServerRequestInterface): Promise<ResponseInterface> => {
                    const response = responseFactory.createResponse(200);
                    response.getBody().end(`Hello, ${request.getAttribute('name')}`);

                    return response;
                },
            )),
        ])),
        responseFactory,
    ),
]);
```

### Server

#### Node

```sh
npm i @chubbyjs/chubbyjs-node-psr-http-message-bridge@1.2.3
```

```ts
import Application from '@chubbyjs/chubbyjs-framework/dist/Application';
import ServerRequestFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/ServerRequestFactory';
import StreamFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/StreamFactory';
import UriFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/UriFactory';
import NodeResponseEmitter from '@chubbyjs/chubbyjs-node-psr-http-message-bridge/dist/NodeResponseEmitter';
import PsrRequestFactory from '@chubbyjs/chubbyjs-node-psr-http-message-bridge/dist/PsrRequestFactory';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const app = new Application([...]);

const psrRequestFactory = new PsrRequestFactory(
    new ServerRequestFactory(),
    new UriFactory(),
    new StreamFactory(),
);

const nodeResponseEmitter = new NodeResponseEmitter();

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const serverRequest = psrRequestFactory.create(req);
    const response = await app.handle(serverRequest);

    nodeResponseEmitter.emit(response, res);
});

server.listen(8080, '0.0.0.0');
```

#### uWebSockets.js

```sh
npm i @chubbyjs/chubbyjs-uwebsockets-psr-http-message-bridge@1.1.1
```

```ts
import Application from '@chubbyjs/chubbyjs-framework/dist/Application';
import ServerRequestFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/ServerRequestFactory';
import StreamFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/StreamFactory';
import UriFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/UriFactory';
import PsrRequestFactory from '@chubbyjs/chubbyjs-uwebsockets-psr-http-message-bridge/dist/PsrRequestFactory';
import UwebsocketResponseEmitter from '@chubbyjs/chubbyjs-uwebsockets-psr-http-message-bridge/dist/UwebsocketResponseEmitter';
import { HttpRequest, HttpResponse } from 'uWebSockets.js';

const app = new Application([...]);

const psrRequestFactory = new PsrRequestFactory(
    new ServerRequestFactory(),
    new UriFactory(),
    new StreamFactory(),
);

const uwebsocketResponseEmitter = new UwebsocketResponseEmitter();

require('uWebSockets.js')
    .App()
    .any('/*', async (res: HttpResponse, req: HttpRequest) => {
        const serverRequest = psrRequestFactory.create(req, res);
        const response = await app.handle(serverRequest);

        uwebsocketResponseEmitter.emit(response, res);
    })
    .listen('0.0.0.0', 8080, (listenSocket: unknown) => {
        if (listenSocket) {
            console.log('Listening to port 0.0.0.0:8080');
        }
    });
```

## Copyright

Dominik Zogg 2021

[1]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-framework
[2]: https://web-frameworks-benchmark.netlify.app/result
[3]: https://www.npmjs.com/package/@chubbyjs/psr-http-server-middleware
[4]: https://www.npmjs.com/package/@chubbyjs/psr-container
[5]: https://www.npmjs.com/package/@chubbyjs/psr-http-factory
[6]: https://www.npmjs.com/package/@chubbyjs/psr-http-message
[7]: https://www.npmjs.com/package/@chubbyjs/psr-http-server-handler
[8]: https://www.npmjs.com/package/@chubbyjs/psr-http-server-middleware
[9]: https://www.npmjs.com/package/@chubbyjs/psr-log
[10]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-http-message
[11]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-framework-router-path-to-regexp
[12]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-node-psr-http-message-bridge
[13]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-uwebsockets-psr-http-message-bridge
