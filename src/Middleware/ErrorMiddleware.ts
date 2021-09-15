import ResponseFactoryInterface from '@chubbyjs/psr-http-factory/dist/ResponseFactoryInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import LoggerInterface from '@chubbyjs/psr-log/dist/LoggerInterface';
import NullLogger from '@chubbyjs/psr-log/dist/NullLogger';
import { errorTemplate } from '../Html';

class ErrorMiddleware implements MiddlewareInterface {
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

    private handleError(error: unknown): ResponseInterface {
        this.logger.error('Error', { error });

        const response = this.responseFactory.createResponse(500).withHeader('Content-Type', 'text/html');

        const body = response.getBody();

        body.end(
            errorTemplate
                .replace(/__STATUS__/g, '500')
                .replace(/__TITLE__/g, 'Internal Server Error')
                .replace(
                    /__BODY__/g,
                    `The requested page failed to load, please try again later.${
                        this.debug ? this.addDebugToBody(error) : ''
                    }`,
                ),
        );

        return response;
    }

    private eToError(e: unknown): Error {
        if (e instanceof Error) {
            return e;
        }

        const error = new Error(typeof e === 'object' ? '' + JSON.stringify(e) : `${String(e)}`);
        error.name = typeof e;
        error.stack = undefined;

        return error;
    }

    private addDebugToBody(e: unknown): string {
        const errors: Array<Error> = [];

        do {
            errors.push(this.eToError(e));
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
