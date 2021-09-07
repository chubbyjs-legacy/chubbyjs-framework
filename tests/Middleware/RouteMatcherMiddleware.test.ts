import ArgumentCallback from '@chubbyjs/chubbyjs-mock/dist/Argument/ArgumentCallback';
import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ResponseFactoryInterface from '@chubbyjs/psr-http-factory/dist/ResponseFactoryInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import LoggerInterface from '@chubbyjs/psr-log/dist/LoggerInterface';
import { describe, expect, test } from '@jest/globals';
import RouteMatcherMiddleware from '../../src/Middleware/RouteMatcherMiddleware';
import NotFoundError from '../../src/Router/Error/NotFoundError';
import RouteInterface from '../../src/Router/RouteInterface';
import RouteMatcherInterface from '../../src/Router/RouteMatcherInterface';
import ResponseFactoryDouble from '../Double/Psr/HttpFactory/ResponseFactoryDouble';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import LoggerDouble from '../Double/Psr/Log/LoggerDouble';
import RouteDouble from '../Double/Router/RouteDouble';
import RouteMatcherDouble from '../Double/Router/RouteMatcherDouble';

const mockByCalls = new MockByCalls();

describe('RouteMatcherMiddleware', () => {
    describe('process', () => {
        test('with random error, without log', () => {
            const error = new Error('example');

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble);

            const routeMatcher = mockByCalls.create<RouteMatcherInterface>(RouteMatcherDouble, [
                Call.create('match').with(request).willThrowError(error),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory);

            expect(() => {
                middleware.process(request, handler);
            }).toThrow(error);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(routeMatcher)).toBe(true);
        });

        test('without match, without log', () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            let responseData = '';

            const responseBody = {
                end: (data: string) => {
                    responseData = data;
                },
            };

            const responseGetBody = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('getBody').with().willReturn(responseBody),
            ]);

            const responseWithHeader = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('withHeader').with('Content-Type', 'text/html').willReturn(responseGetBody),
            ]);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble, [
                Call.create('createResponse').with(404).willReturn(responseWithHeader),
            ]);

            const routeMatcher = mockByCalls.create<RouteMatcherInterface>(RouteMatcherDouble, [
                Call.create('match').with(request).willThrowError(NotFoundError.create('/path')),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory);

            expect(middleware.process(request, handler)).toBe(responseGetBody);

            expect(responseData).toMatchInlineSnapshot(`
"
    <html>
        <head>
            <meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=utf-8\\">
            <title>NotFoundError</title>
            <style>
                body {
                    margin: 0;
                    padding: 30px;
                    font: 12px/1.5 Helvetica, Arial, Verdana, sans-serif;
                }
                h1 {
                    margin: 0;
                    font-size: 48px;
                    font-weight: normal;
                    line-height: 48px;
                }
                .block {
                    margin-bottom: 20px;
                }
                .key {
                    width: 100px;
                    display: inline-flex;
                }
                .value {
                    display: inline-flex;
                }
            </style>
        </head>
        <body>
            <h1>NotFoundError</h1><p>The page \\"/path\\" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.</p>
        </body>
    </html>"
`);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(routeMatcher)).toBe(true);
        });

        test('without match, with log', () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            let responseData = '';

            const responseBody = {
                end: (data: string) => {
                    responseData = data;
                },
            };

            const responseGetBody = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('getBody').with().willReturn(responseBody),
            ]);

            const responseWithHeader = mockByCalls.create<ResponseInterface>(ResponseDouble, [
                Call.create('withHeader').with('Content-Type', 'text/html').willReturn(responseGetBody),
            ]);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble, [
                Call.create('createResponse').with(404).willReturn(responseWithHeader),
            ]);

            const routeMatcher = mockByCalls.create<RouteMatcherInterface>(RouteMatcherDouble, [
                Call.create('match').with(request).willThrowError(NotFoundError.create('/path')),
            ]);

            const logger = mockByCalls.create<LoggerInterface>(LoggerDouble, [
                Call.create('info').with(
                    'Route error',
                    new ArgumentCallback((context: { name: string; message: string; code: number }) => {
                        expect(context).toEqual({
                            name: 'NotFoundError',
                            message:
                                'The page "/path" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.',
                            code: 404,
                        });
                    }),
                ),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory, logger);

            expect(middleware.process(request, handler)).toBe(responseGetBody);

            expect(responseData).toMatch(/NotFoundError/);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(routeMatcher)).toBe(true);
            expect(mockByCallsUsed(logger)).toBe(true);
        });

        test('with match, with log', () => {
            const attributes = new Map([['key', 'value']]);

            const route = mockByCalls.create<RouteInterface>(RouteDouble, [
                Call.create('getAttributes').with().willReturn(attributes),
            ]);

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const requestWithAttributeKey = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble, [
                Call.create('withAttribute').with('key', 'value').willReturn(request),
            ]);

            const requestWithAttributeRoute = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble, [
                Call.create('withAttribute').with('route', route).willReturn(requestWithAttributeKey),
            ]);

            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble);

            const routeMatcher = mockByCalls.create<RouteMatcherInterface>(RouteMatcherDouble, [
                Call.create('match').with(requestWithAttributeRoute).willReturn(route),
            ]);

            const logger = mockByCalls.create<LoggerInterface>(LoggerDouble);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle').with(request).willReturn(response),
            ]);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory, logger);

            expect(middleware.process(requestWithAttributeRoute, handler)).toBe(response);

            expect(mockByCallsUsed(route)).toBe(true);
            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(requestWithAttributeKey)).toBe(true);
            expect(mockByCallsUsed(requestWithAttributeRoute)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(routeMatcher)).toBe(true);
            expect(mockByCallsUsed(logger)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
        });
    });
});
