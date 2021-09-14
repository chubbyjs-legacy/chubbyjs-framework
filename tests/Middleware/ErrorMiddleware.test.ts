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
        test('successful', async () => {
            const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
            const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

            const responseFactory = mockByCalls.create<ResponseFactoryInterface>(ResponseFactoryDouble);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle')
                    .with(request)
                    .willReturnCallback(async () => response),
            ]);

            const middleware = new ErrorMiddleware(responseFactory);

            expect(await middleware.process(request, handler)).toBe(response);

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(response)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
        });

        test('without debug, without log', async () => {
            const previousError = new Error('previous');
            previousError.stack = 'Error: previous\nat Line1\nat Line2\nat Line3';

            const error = new Error('error');
            error.stack = 'Error: error\nat Line1\nat Line2';

            // @ts-ignore
            error.previous = previousError;

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
                Call.create('createResponse').with(500).willReturn(responseWithHeader),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle')
                    .with(request)
                    .willReturnCallback(async () => {
                        throw error;
                    }),
            ]);

            const middleware = new ErrorMiddleware(responseFactory);

            expect(await middleware.process(request, handler)).toBe(responseGetBody);

            expect(responseData.replace(/\n/g, '').replace(/ {2,}/g, '')).toEqual(
                `<html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <title>Internal Server Error</title>
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
                            <div class="inline-block align-top text-gray-400 border-r-2 border-gray-400 pr-5 mr-5 text-5xl">500</div>
                            <div class="inline-block align-top">
                                <div class="text-5xl">Internal Server Error</div>
                                <div class="mt-3">The requested page failed to load, please try again later.</div>
                            </div>
                        </div>
                    </body>
                </html>`
                    .replace(/\n/g, '')
                    .replace(/ {2,}/g, ''),
            );

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
        });

        test('with debug, with log', async () => {
            const previousError = new Error('previous');
            previousError.stack = 'Error: previous\nat Line1\nat Line2\nat Line3';

            const error = new Error('error');
            error.stack = 'Error: error\nat Line1\nat Line2';

            // @ts-ignore
            error.previous = previousError;

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
                Call.create('createResponse').with(500).willReturn(responseWithHeader),
            ]);

            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                Call.create('handle')
                    .with(request)
                    .willReturnCallback(async () => {
                        throw error;
                    }),
            ]);

            const logger = mockByCalls.create<LoggerInterface>(LoggerDouble, [
                Call.create('error').with(
                    'Error',
                    new ArgumentCallback((context: unknown) => {
                        expect(context).toEqual({ error });
                    }),
                ),
            ]);

            const middleware = new ErrorMiddleware(responseFactory, true, logger);

            expect(await middleware.process(request, handler)).toBe(responseGetBody);

            expect(responseData.replace(/\n/g, '').replace(/ {2,}/g, '')).toEqual(
                `<html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <title>Internal Server Error</title>
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
                            <div class="inline-block align-top text-gray-400 border-r-2 border-gray-400 pr-5 mr-5 text-5xl">500</div>
                            <div class="inline-block align-top">
                                <div class="text-5xl">Internal Server Error</div>
                                <div class="mt-3">
                                    The requested page failed to load, please try again later.
                                    <div class="mt-3">
                                        Error: error
                                        <br>&nbsp;&nbsp;&nbsp;&nbsp;at Line1
                                        <br>&nbsp;&nbsp;&nbsp;&nbsp;at Line2
                                    </div>
                                    <div class="mt-3">
                                        Error: previous
                                        <br>&nbsp;&nbsp;&nbsp;&nbsp;at Line1
                                        <br>&nbsp;&nbsp;&nbsp;&nbsp;at Line2
                                        <br>&nbsp;&nbsp;&nbsp;&nbsp;at Line3
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>`
                    .replace(/\n/g, '')
                    .replace(/ {2,}/g, ''),
            );

            expect(mockByCallsUsed(request)).toBe(true);
            expect(mockByCallsUsed(responseGetBody)).toBe(true);
            expect(mockByCallsUsed(responseWithHeader)).toBe(true);
            expect(mockByCallsUsed(handler)).toBe(true);
            expect(mockByCallsUsed(responseFactory)).toBe(true);
            expect(mockByCallsUsed(logger)).toBe(true);
        });

        [
            { e: undefined, error: { name: 'undefined', message: 'undefined' } },
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
            test('with debug, with log (' + JSON.stringify(e) + ')', async () => {
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
                    Call.create('createResponse').with(500).willReturn(responseWithHeader),
                ]);

                const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
                    Call.create('handle')
                        .with(request)
                        .willReturnCallback(async () => {
                            throw e;
                        }),
                ]);

                const logger = mockByCalls.create<LoggerInterface>(LoggerDouble, [
                    Call.create('error').with(
                        'Error',
                        new ArgumentCallback((context: { error: unknown }) => {
                            expect(context.error).toBe(e);
                        }),
                    ),
                ]);

                const middleware = new ErrorMiddleware(responseFactory, true, logger);

                expect(await middleware.process(request, handler)).toBe(responseGetBody);

                expect(responseData.replace(/\n/g, '').replace(/ {2,}/g, '')).toEqual(
                    `<html>
                            <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                <title>Internal Server Error</title>
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
                                    <div class="inline-block align-top text-gray-400 border-r-2 border-gray-400 pr-5 mr-5 text-5xl">500</div>
                                    <div class="inline-block align-top">
                                        <div class="text-5xl">Internal Server Error</div>
                                        <div class="mt-3">
                                            The requested page failed to load, please try again later.
                                            <div class="mt-3">${error.name}: ${error.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                        </html>`
                        .replace(/\n/g, '')
                        .replace(/ {2,}/g, ''),
                );

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
