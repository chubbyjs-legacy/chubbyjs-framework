import ResponseFactoryInterface from '@chubbyjs/psr-http-factory/dist/ResponseFactoryInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import LoggerInterface from '@chubbyjs/psr-log/dist/LoggerInterface';
import NullLogger from '@chubbyjs/psr-log/dist/NullLogger';
import HttpErrorInterface, { isHttpError } from '../Router/Error/HttpErrorInterface';
import RouteMatcherInterface from '../Router/RouteMatcherInterface';

class RouteMatcherMiddleware implements MiddlewareInterface {
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
        private routeMatcher: RouteMatcherInterface,
        private responseFactory: ResponseFactoryInterface,
        private logger: LoggerInterface = new NullLogger(),
    ) {}

    public process(request: ServerRequestInterface, handler: RequestHandlerInterface): ResponseInterface {
        try {
            const route = this.routeMatcher.match(request);

            request = request.withAttribute('route', route);

            route.getAttributes().forEach((value, key) => {
                request = request.withAttribute(key, value);
            });

            return handler.handle(request);
        } catch (error) {
            if (isHttpError(error)) {
                return this.routeErrorResponse(error);
            }

            throw error;
        }
    }

    private routeErrorResponse(routerError: HttpErrorInterface): ResponseInterface {
        this.logger.info('Route error', {
            name: routerError.name,
            message: routerError.message,
            code: routerError.code,
        });

        const response = this.responseFactory.createResponse(routerError.code).withHeader('Content-Type', 'text/html');

        const body = response.getBody();

        body.end(
            this.html
                .replace('__TITLE__', routerError.name)
                .replace('__BODY__', `<h1>${routerError.name}</h1><p>${routerError.message}</p>`),
        );

        return response;
    }
}

export default RouteMatcherMiddleware;
