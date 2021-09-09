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
        try {
            return await handler.handle(request);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(e: any): ResponseInterface {
        const error = this.eToError(e);

        this.logger.error('Error', { error });

        let htmlBody =
            '<h1>Application Error</h1>' +
            '<p>A website error has occurred. Sorry for the temporary inconvenience.</p>';

        if (this.debug) {
            htmlBody += this.addDebugToBody(error);
        }

        const response = this.responseFactory.createResponse(500).withHeader('Content-Type', 'text/html');

        const body = response.getBody();

        body.end(this.html.replace('__TITLE__', 'Application Error').replace('__BODY__', htmlBody));

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

    private addDebugToBody(error: Error): string {
        return `
            <h2>Details</h2>
            <div class"block">
                <div><div class="key"><strong>name</strong></div><div class="value">${error.name}</div></div>
                <div><div class="key"><strong>message</strong></div><div class="value">${error.message}</div></div>
                <div><div class="key"><strong>stack</strong></div><div class="value">${error.stack ?? ''}</div></div>
            </div>`;
    }
}

export default ErrorMiddleware;
