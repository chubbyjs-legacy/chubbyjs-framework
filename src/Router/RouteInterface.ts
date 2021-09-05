import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';

interface RouteInterface {
    getMethod(): Method;
    getPath(): string;
    getName(): string;
    getRequestHandler(): RequestHandlerInterface;
    getMiddlewares(): Array<MiddlewareInterface>;
    getPathOptions(): Map<string, unknown>;
    withAttributes(attributes: Map<string, string>): this;
    getAttributes(): Map<string, any>;
    _routeInterface: string;
}

export const isRoute = (route: unknown): route is RouteInterface => {
    return typeof route === 'object' && null !== route && typeof (route as RouteInterface)._routeInterface === 'string';
};

export default RouteInterface;
