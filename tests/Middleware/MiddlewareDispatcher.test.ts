import ArgumentInstanceOf from '@chubbyjs/chubbyjs-mock/dist/Argument/ArgumentInstanceOf';
import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import { describe, expect, test } from '@jest/globals';
import MiddlewareDispatcher from '../../src/Middleware/MiddlewareDispatcher';
import MiddlewareRequestHandler from '../../src/Middleware/MiddlewareRequestHandler';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import MiddlewareDouble from '../Double/Psr/HttpServerMiddleware/MiddlewareDouble';

const mockByCalls = new MockByCalls();

describe('MiddlewareDispatcher', () => {
    describe('dispatch', () => {
        test('without middleware', () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle').with(request).willReturn(response),
            ]);

            const middlewareDispatcher = new MiddlewareDispatcher();

            expect(middlewareDispatcher.dispatch([], handler, request)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
        });

        test('with middlewares', () => {
            const requestWithAttribute = [
                Call.create('withAttribute').with('middleware', 'middleware1').willReturnSelf(),
                Call.create('withAttribute').with('middleware', 'middleware2').willReturnSelf(),
            ];

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble, [
                ...requestWithAttribute,
                ...requestWithAttribute,
            ]);

            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const handlerHandle = Call.create('handle').with(request).willReturn(response);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                handlerHandle,
                handlerHandle,
            ]);

            const middlware1Process = Call.create('process')
                .with(request, new ArgumentInstanceOf(MiddlewareRequestHandler))
                .willReturnCallback((request: ServerRequestInterface, handler: RequestHandlerInterface) => {
                    return handler.handle(request.withAttribute('middleware', 'middleware1'));
                });

            const middleware1 = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble, [
                middlware1Process,
                middlware1Process,
            ]);

            const middleware2Process = Call.create('process')
                .with(request, handler)
                .willReturnCallback((request: ServerRequestInterface, handler: RequestHandlerInterface) => {
                    return handler.handle(request.withAttribute('middleware', 'middleware2'));
                });

            const middleware2 = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble, [
                middleware2Process,
                middleware2Process,
            ]);

            const middlewares = [middleware1, middleware2];

            const middlewareDispatcher = new MiddlewareDispatcher();

            expect(middlewareDispatcher.dispatch(middlewares, handler, request)).toBe(response);
            expect(middlewareDispatcher.dispatch(middlewares, handler, request)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(middleware1)).toBe(true);
            expect(mockByCallsUsed(middleware2)).toBe(true);
        });
    });
});
