import ResponseFactoryInterface from '@chubbyjs/psr-http-factory/dist/ResponseFactoryInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import LoggerInterface from '@chubbyjs/psr-log/dist/LoggerInterface';
import NullLogger from '@chubbyjs/psr-log/dist/NullLogger';
import { errorTemplate } from '../Html';
import HttpErrorInterface, { isHttpError } from '../Router/Error/HttpErrorInterface';
import RouteInterface from '../Router/RouteInterface';
import RouteMatcherInterface from '../Router/RouteMatcherInterface';

class RouteMatcherMiddleware implements MiddlewareInterface {
    public constructor(
        private routeMatcher: RouteMatcherInterface,
        private responseFactory: ResponseFactoryInterface,
        private logger: LoggerInterface = new NullLogger(),
    ) {}

    public async process(
        request: ServerRequestInterface,
        handler: RequestHandlerInterface,
    ): Promise<ResponseInterface> {
        let route: RouteInterface;

        try {
            route = this.routeMatcher.match(request);
        } catch (error) {
            if (isHttpError(error)) {
                return this.routeErrorResponse(error);
            }

            throw error;
        }

        request = request.withAttribute('route', route);

        route.getAttributes().forEach((value, key) => {
            request = request.withAttribute(key, value);
        });

        return handler.handle(request);
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
            errorTemplate
                .replace(/__STATUS__/g, routerError.code.toString())
                .replace(/__TITLE__/g, routerError.name)
                .replace(/__BODY__/g, routerError.message),
        );

        return response;
    }
}

export default RouteMatcherMiddleware;
