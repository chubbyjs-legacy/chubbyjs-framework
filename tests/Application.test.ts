import ArgumentInstanceOf from '@chubbyjs/chubbyjs-mock/dist/Argument/ArgumentInstanceOf';
import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import { describe, expect, test } from '@jest/globals';
import Application from '../src/Application';
import MiddlewareDispatcherInterface from '../src/Middleware/MiddlewareDispatcherInterface';
import RouteRequestHandler from '../src/RequestHandler/RouteRequestHandler';
import MissingRouteAttributeOnRequestError from '../src/Router/Error/MissingRouteAttributeOnRequestError';
import MiddlewareDispatcherDouble from './Double/Middleware/MiddlewareDispatcherDouble';
import ResponseDouble from './Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from './Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from './Double/Psr/HttpServerHandler/RequestHandlerDouble';

const mockByCalls = new MockByCalls();

describe('Application', () => {
    describe('handle', () => {
        test('without middlewares', async () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble, [
                Call.create('getAttribute').with('route').willReturn(undefined),
            ]);

            const application = new Application([]);

            await expect(application.handle(request)).rejects.toEqual(
                MissingRouteAttributeOnRequestError.create(undefined),
            );

            expect(mockByCallsUsed(request)).toBe(true);
        });

        test('with custom request handler', async () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle')
                    .with(request)
                    .willReturnCallback(async () => response),
            ]);

            const application = new Application([], undefined, handler);

            expect(await application.handle(request)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
        });

        test('with custom middleware dispatcher', async () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const middlewares: Array<MiddlewareInterface> = [];

            const middlewareDispatcher = mockByCalls.create<MiddlewareDispatcherInterface>(MiddlewareDispatcherDouble, [
                Call.create('dispatch')
                    .with(middlewares, new ArgumentInstanceOf(RouteRequestHandler), request)
                    .willReturn(response),
            ]);

            const application = new Application(middlewares, middlewareDispatcher);

            expect(await application.handle(request)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(middlewareDispatcher)).toBe(true);
        });
    });
});
