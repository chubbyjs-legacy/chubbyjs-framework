import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareDispatcherInterface from '../Middleware/MiddlewareDispatcherInterface';
import MissingRouteAttributeOnRequestError from '../Router/Error/MissingRouteAttributeOnRequestError';
import { isRoute } from '../Router/RouteInterface';

class RouteRequestHandler implements RequestHandlerInterface {
    public constructor(private middlewareDispatcher: MiddlewareDispatcherInterface) {}

    public async handle(request: ServerRequestInterface): Promise<ResponseInterface> {
        const route = request.getAttribute('route');

        if (isRoute(route)) {
            return this.middlewareDispatcher.dispatch(route.getMiddlewares(), route.getRequestHandler(), request);
        }

        throw MissingRouteAttributeOnRequestError.create(route);
    }
}

export default RouteRequestHandler;
