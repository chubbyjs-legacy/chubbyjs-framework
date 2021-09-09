import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import { describe, expect, test } from '@jest/globals';
import MiddlewareRequestHandler from '../../src/Middleware/MiddlewareRequestHandler';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import MiddlewareDouble from '../Double/Psr/HttpServerMiddleware/MiddlewareDouble';

const mockByCalls = new MockByCalls();

describe('MiddlewareRequestHandler', () => {
    describe('dispatch', () => {
        test('without middleware', async () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle')
                    .with(request)
                    .willReturnCallback(async () => response),
            ]);

            const middleware = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble, [
                Call.create('process')
                    .with(request, handler)
                    .willReturnCallback(async (request: ServerRequestInterface, handler: RequestHandlerInterface) => {
                        return handler.handle(request);
                    }),
            ]);

            const middlewareRequestHandler = new MiddlewareRequestHandler(middleware, handler);

            expect(await middlewareRequestHandler.handle(request)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(middleware)).toBe(true);
        });
    });
});
