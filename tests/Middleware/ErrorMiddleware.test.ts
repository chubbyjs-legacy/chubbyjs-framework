import ArgumentCallback from '@chubbyjs/chubbyjs-mock/dist/Argument/ArgumentCallback';
import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseFactoryInterface from '@chubbyjs/psr-http-factory/dist/ResponseFactoryInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import LoggerInterface from '@chubbyjs/psr-log/dist/LoggerInterface';
import { describe, expect, test } from '@jest/globals';
import ErrorMiddleware from '../../src/Middleware/ErrorMiddleware';
import ResponseFactoryDouble from '../Double/Psr/HttpFactory/ResponseFactoryDouble';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import LoggerDouble from '../Double/Psr/Log/LoggerDouble';

const mockByCalls = new MockByCalls();

describe('ErrorMiddleware', () => {
    describe('process', () => {
        test('without debug, without log', () => {
            const error = new Error('example');

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const responseBody = {
                write: (data: string) => {
                    expect(data).toMatch(/Application Error/);
                },
                end: () => {},
            };

            const responseGetBody = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('getBody').with().willReturn(responseBody),
            ]);

            const responseWithHeader = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('withHeader').with('Content-Type', 'text/html').willReturn(responseGetBody),
            ]);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble, [
                Call.create('createResponse').with(500).willReturn(responseWithHeader),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle').with(request).willThrowError(error),
            ]);

            const middleware = new ErrorMiddleware(responseFactory);

            expect(middleware.process(request, handler)).toBe(responseGetBody);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
        });

        test('without debug, with log', () => {
            const error = new Error('example');

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const responseBody = {
                write: (data: string) => {
                    expect(data).toMatch(/Application Error/);
                },
                end: () => {},
            };

            const responseGetBody = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('getBody').with().willReturn(responseBody),
            ]);

            const responseWithHeader = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('withHeader').with('Content-Type', 'text/html').willReturn(responseGetBody),
            ]);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble, [
                Call.create('createResponse').with(500).willReturn(responseWithHeader),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle').with(request).willThrowError(error),
            ]);

            const logger = mockByCalls.create<LoggerInterface>(LoggerDouble, [
                Call.create('error').with(
                    'Error',
                    new ArgumentCallback((context: unknown) => {
                        expect(context).toEqual({ error });
                    }),
                ),
            ]);

            const middleware = new ErrorMiddleware(responseFactory, false, logger);

            expect(middleware.process(request, handler)).toBe(responseGetBody);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(logger)).toBe(true);
        });

        [
            { e: new Error('example'), error: { name: 'Error', message: 'example' } },
            { e: undefined, error: { name: 'undefined', message: '' } },
            { e: null, error: { name: 'object', message: 'null' } },
            { e: true, error: { name: 'boolean', message: 'true' } },
            { e: false, error: { name: 'boolean', message: 'false' } },
            { e: 42, error: { name: 'number', message: '42' } },
            { e: 3.14159, error: { name: 'number', message: '3.14159' } },
            { e: 'example', error: { name: 'string', message: 'example' } },
            { e: Symbol('example'), error: { name: 'symbol', message: 'Symbol(example)' } },
            { e: () => null, error: { name: 'function', message: '() => null' } },
            { e: { key: 'value' }, error: { name: 'object', message: '{"key":"value"}' } },
            { e: new Array('example'), error: { name: 'object', message: '["example"]' } },
        ].forEach(({ e, error }) => {
            test('with debug, with log (' + error.name + ')', () => {
                const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

                const responseBody = {
                    write: (data: string) => {},
                    end: () => {},
                };

                const responseGetBody = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                    Call.create('getBody').with().willReturn(responseBody),
                ]);

                const responseWithHeader = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                    Call.create('withHeader').with('Content-Type', 'text/html').willReturn(responseGetBody),
                ]);

                const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble, [
                    Call.create('createResponse').with(500).willReturn(responseWithHeader),
                ]);

                const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                    Call.create('handle')
                        .with(request)
                        .willReturnCallback(() => {
                            throw e;
                        }),
                ]);

                const logger = mockByCalls.create<LoggerInterface>(LoggerDouble, [
                    Call.create('error').with(
                        'Error',
                        new ArgumentCallback((context: { error: { name: string; message: string; stack: string } }) => {
                            expect(context.error.name).toBe(error.name);
                            expect(context.error.message).toBe(error.message);
                        }),
                    ),
                ]);

                const middleware = new ErrorMiddleware(responseFactory, true, logger);

                expect(middleware.process(request, handler)).toBe(responseGetBody);

                expect(mockByCallsUsed(request)).toBe(true);
                expect(mockByCallsUsed(responseGetBody)).toBe(true);
                expect(mockByCallsUsed(responseWithHeader)).toBe(true);
                expect(mockByCallsUsed(handler)).toBe(true);
                expect(mockByCallsUsed(responseFactory)).toBe(true);
                expect(mockByCallsUsed(logger)).toBe(true);
            });
        });
    });
});
