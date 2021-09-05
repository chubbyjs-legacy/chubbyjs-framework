import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import { describe, expect, test } from '@jest/globals';
import LazyMiddleware from '../../src/Middleware/LazyMiddleware';
import ContainerDouble from '../Double/Psr/Container/ContainerDouble';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import MiddlewareDouble from '../Double/Psr/HttpServerMiddleware/MiddlewareDouble';

const mockByCalls = new MockByCalls();

describe('LazyMiddleware', () => {
    test('process', () => {
        const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
        const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

        const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

        const middleware = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble, [
            Call.create('process').with(request, handler).willReturn(response),
        ]);

        const container = mockByCalls.create<ContainerInterface>(ContainerDouble, [
            Call.create('get').with('id').willReturn(middleware),
        ]);

        const lazyMiddleware = new LazyMiddleware(container, 'id');

        expect(lazyMiddleware.process(request, handler)).toBe(response);

        expect(mockByCallsUsed(request)).toBe(true);
        expect(mockByCallsUsed(response)).toBe(true);
        expect(mockByCallsUsed(handler)).toBe(true);
        expect(mockByCallsUsed(middleware)).toBe(true);
        expect(mockByCallsUsed(container)).toBe(true);
    });
});
