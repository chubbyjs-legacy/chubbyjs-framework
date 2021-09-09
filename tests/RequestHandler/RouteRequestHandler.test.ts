import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import { describe, expect, test } from '@jest/globals';
import MiddlewareDispatcherInterface from '../../src/Middleware/MiddlewareDispatcherInterface';
import RouteRequestHandler from '../../src/RequestHandler/RouteRequestHandler';
import MissingRouteAttributeOnRequestError from '../../src/Router/Error/MissingRouteAttributeOnRequestError';
import RouteInterface from '../../src/Router/RouteInterface';
import MiddlewareDispatcherDouble from '../Double/Middleware/MiddlewareDispatcherDouble';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import MiddlewareDouble from '../Double/Psr/HttpServerMiddleware/MiddlewareDouble';
import RouteDouble from '../Double/Router/RouteDouble';

const mockByCalls = new MockByCalls();

describe('RouteRequestHandler', () => {
    describe('handle', () => {
        test('without route, expect error', async () => {
            const error = MissingRouteAttributeOnRequestError.create(undefined);

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble, [
                Call.create('getAttribute').with('route').willReturn(undefined),
            ]);

            const middlewareDispatcher = mockByCalls.create<MiddlewareDispatcherInterface>(MiddlewareDispatcherDouble);

            const handler = new RouteRequestHandler(middlewareDispatcher);

            await expect(handler.handle(request)).rejects.toEqual(error);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(middlewareDispatcher)).toBe(true);
        });

        test('with route, expect response', async () => {
            const routeMiddleware = mockByCalls.create<RequestHandlerInterface>(MiddlewareDouble);

            const routeMiddlewares = [routeMiddleware];

            const routeRequesthandler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const route = mockByCalls.create<RouteInterface>(RouteDouble, [
                Call.create('getMiddlewares').with().willReturn(routeMiddlewares),
                Call.create('getRequestHandler').with().willReturn(routeRequesthandler),
            ]);

            // is needed for the isRoute guard
            route._routeInterface = 'RouteDouble';

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble, [
                Call.create('getAttribute').with('route').willReturn(route),
            ]);

            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const middlewareDispatcher = mockByCalls.create<MiddlewareDispatcherInterface>(MiddlewareDispatcherDouble, [
                Call.create('dispatch').with(routeMiddlewares, routeRequesthandler, request).willReturn(response),
            ]);

            const handler = new RouteRequestHandler(middlewareDispatcher);

            expect(await handler.handle(request)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(middlewareDispatcher)).toBe(true);
        });
    });
});
