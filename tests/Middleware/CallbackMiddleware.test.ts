import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import { describe, expect, test } from '@jest/globals';
import CallbackMiddleware from '../../src/Middleware/CallbackMiddleware';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';

const mockByCalls = new MockByCalls();

describe('CallbackMiddleware', () => {
    test('process', async () => {
        const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
        const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

        const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
            Call.create('handle').with(request).willReturn(response),
        ]);

        const middleware = new CallbackMiddleware(
            (request: ServerRequestInterface, handler: RequestHandlerInterface): Promise<ResponseInterface> => {
                return handler.handle(request);
            },
        );

        expect(await middleware.process(request, handler)).toBe(response);

        expect(mockByCallsUsed(request)).toBe(true);
        expect(mockByCallsUsed(response)).toBe(true);
        expect(mockByCallsUsed(handler)).toBe(true);
    });
});
