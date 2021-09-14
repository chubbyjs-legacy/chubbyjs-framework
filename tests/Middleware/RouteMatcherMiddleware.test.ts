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
        test('with random error, without log', async () => {
            const error = new Error('example');

            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble);

            const routeMatcher = mockByCalls.create<RouteMatcherInterface>(RouteMatcherDouble, [
                Call.create('match').with(request).willThrowError(error),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory);

            await expect(middleware.process(request, handler)).rejects.toEqual(error);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(routeMatcher)).toBe(true);
        });

        test('without match, with log', async () => {
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
                            name: 'Not Found',
                            message:
                                'The page "/path" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.',
                            code: 404,
                        });
                    }),
                ),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory, logger);

            expect(await middleware.process(request, handler)).toBe(responseGetBody);

            expect(responseData.replace(/\n/g, '').replace(/ {2,}/g, '')).toEqual(
                `
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <title>Not Found</title>
                        <style>
                            html {
                                font-family: Helvetica, Arial, Verdana, sans-serif;
                                line-height: 1.5;
                                tab-size: 4;
                            }

                            body {
                                margin: 0;
                            }

                            * {
                                border-width: 0;
                                border-style: solid;
                            }

                            .container {
                                width: 100%
                            }

                            @media (min-width:640px) {
                                .container {
                                    max-width: 640px
                                }
                            }

                            @media (min-width:768px) {
                                .container {
                                    max-width: 768px
                                }
                            }

                            @media (min-width:1024px) {
                                .container {
                                    max-width: 1024px
                                }
                            }

                            @media (min-width:1280px) {
                                .container {
                                    max-width: 1280px
                                }
                            }

                            @media (min-width:1536px) {
                                .container {
                                    max-width: 1536px
                                }
                            }

                            .mx-auto {
                                margin-left: auto;
                                margin-right: auto;
                            }

                            .inline-block {
                                display: inline-block;
                            }

                            .align-top {
                                vertical-align: top;
                            }

                            .mt-3 {
                                margin-top: .75rem;
                            }

                            .mt-12 {
                                margin-top: 3rem;
                            }

                            .mr-5 {
                                margin-right: 1.25rem;
                            }

                            .pr-5 {
                                padding-right: 1.25rem;
                            }

                            .text-gray-400 {
                                --tw-text-opacity: 1;
                                color: rgba(156, 163, 175, var(--tw-text-opacity));
                            }

                            .text-5xl {
                                font-size: 3rem;
                                line-height: 1;
                            }

                            .tracking-tighter {
                                letter-spacing: -.05em;
                            }

                            .border-gray-400 {
                                --tw-border-opacity: 1;
                                border-color: rgba(156, 163, 175, var(--tw-border-opacity));
                            }

                            .border-r-2 {
                                border-right-width: 2px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container mx-auto tracking-tighter mt-12">
                            <div class="inline-block align-top text-gray-400 border-r-2 border-gray-400 pr-5 mr-5 text-5xl">404</div>
                            <div class="inline-block align-top">
                                <div class="text-5xl">Not Found</div>
                                <div class="mt-3">The page "/path" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.</div>
                            </div>
                        </div>
                    </body>
                </html>
            `
                    .replace(/\n/g, '')
                    .replace(/ {2,}/g, ''),
            );

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(routeMatcher)).toBe(true);
            expect(mockByCallsUsed(logger)).toBe(true);
        });

        test('with match, with log', async () => {
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
                Call.create('handle')
                    .with(request)
                    .willReturnCallback(async () => response),
            ]);

            const middleware = new RouteMatcherMiddleware(routeMatcher, responseFactory, logger);

            expect(await middleware.process(requestWithAttributeRoute, handler)).toBe(response);

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
