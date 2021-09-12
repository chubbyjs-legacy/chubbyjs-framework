import ResponseFactoryInterface from '@chubbyjs/psr-http-factory/dist/ResponseFactoryInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import LoggerInterface from '@chubbyjs/psr-log/dist/LoggerInterface';
import NullLogger from '@chubbyjs/psr-log/dist/NullLogger';

class ErrorMiddleware implements MiddlewareInterface {
    private html: string = `
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <title>__TITLE__</title>
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
                __BODY__
            </body>
        </html>`;

    public constructor(
        private responseFactory: ResponseFactoryInterface,
        private debug: boolean = false,
        private logger: LoggerInterface = new NullLogger(),
    ) {}

    public async process(
        request: ServerRequestInterface,
        handler: RequestHandlerInterface,
    ): Promise<ResponseInterface> {
        return new Promise((resolve) => {
            Promise.resolve(handler.handle(request))
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    resolve(this.handleError(error));
                });
        });
    }

    private handleError(e: unknown): ResponseInterface {
        const error = this.eToError(e);

        this.logger.error('Error', { error });

        const htmlBody = `
            <div class="container mx-auto tracking-tighter mt-12">
                <div class="inline-block align-top text-gray-400 border-r-2 border-gray-400 pr-5 mr-5 text-5xl">500</div>
                <div class="inline-block align-top">
                    <div class="text-5xl">Internal Server Error</div>
                    <div class="mt-3">The requested page failed to load, please try again later.</div>
                    ${this.debug ? this.addDebugToBody(error) : ''}
                </div>
            </div>`;

        const response = this.responseFactory.createResponse(500).withHeader('Content-Type', 'text/html');

        const body = response.getBody();

        body.end(this.html.replace('__TITLE__', 'Internal Server Error').replace('__BODY__', htmlBody));

        return response;
    }

    private eToError(e: unknown): Error {
        if (e instanceof Error) {
            return e;
        }

        if (typeof e === 'undefined') {
            return {
                name: typeof e,
                message: '',
            };
        }

        if (typeof e === 'string' || typeof e === 'symbol' || typeof e === 'function') {
            return {
                name: typeof e,
                message: e.toString(),
            };
        }

        return {
            name: typeof e,
            message: '' + JSON.stringify(e),
        };
    }

    private addDebugToBody(e: unknown): string {
        let error: Error | undefined;
        const errors = [];

        do {
            error = this.eToError(e);
            errors.push(error);
        } while ((e = e && (e as { previous: unknown }).previous));

        return errors
            .map((error) => {
                if (!error.stack) {
                    return `<div class="mt-3">${error.name}: ${error.message}</div>`;
                }

                return `<div class="mt-3">${error.stack.replace(/at /gm, '<br>&nbsp;&nbsp;&nbsp;&nbsp;at ')}</div>`;
            })
            .join('');
    }
}

export default ErrorMiddleware;
