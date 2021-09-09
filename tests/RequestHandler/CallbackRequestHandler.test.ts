import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import { describe, expect, test } from '@jest/globals';
import CallbackRequestHandler from '../../src/RequestHandler/CallbackRequestHandler';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';

const mockByCalls = new MockByCalls();

describe('CallbackRequestHandler', () => {
    test('handle', async () => {
        const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
        const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

        const handler = new CallbackRequestHandler(async (request: ServerRequestInterface) => response);

        expect(await handler.handle(request)).toBe(response);

        expect(mockByCallsUsed(request)).toBe(true);
        expect(mockByCallsUsed(response)).toBe(true);
    });
});
