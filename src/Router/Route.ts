import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import RouteInterface, { PathOptions } from './RouteInterface';

class Route implements RouteInterface {
    private attributes: Map<string, any> = new Map<string, any>();

    private constructor(
        private method: Method,
        private path: string,
        private name: string,
        private requestHandler: RequestHandlerInterface,
        private middlewares: Array<MiddlewareInterface>,
        private pathOptions: PathOptions,
    ) {}

    public static create(
        method: Method,
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(method, path, name, requestHandler, middlewares, pathOptions);
    }

    public static delete(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.DELETE, path, name, requestHandler, middlewares, pathOptions);
    }

    public static get(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.GET, path, name, requestHandler, middlewares, pathOptions);
    }

    public static head(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.HEAD, path, name, requestHandler, middlewares, pathOptions);
    }

    public static options(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.OPTIONS, path, name, requestHandler, middlewares, pathOptions);
    }

    public static patch(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.PATCH, path, name, requestHandler, middlewares, pathOptions);
    }

    public static post(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.POST, path, name, requestHandler, middlewares, pathOptions);
    }

    public static put(
        path: string,
        name: string,
        requestHandler: RequestHandlerInterface,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Route {
        return new Route(Method.PUT, path, name, requestHandler, middlewares, pathOptions);
    }

    public getMethod(): Method {
        return this.method;
    }

    public getPath(): string {
        return this.path;
    }

    public getName(): string {
        return this.name;
    }

    public getRequestHandler(): RequestHandlerInterface {
        return this.requestHandler;
    }

    public getMiddlewares(): Array<MiddlewareInterface> {
        return [...this.middlewares];
    }

    public getPathOptions(): PathOptions {
        return { ...this.pathOptions };
    }

    public withAttributes(attributes: Map<string, string>): this {
        const route = new Route(
            this.method,
            this.path,
            this.name,
            this.requestHandler,
            this.middlewares,
            this.pathOptions,
        ) as this;

        route.attributes = attributes;

        return route;
    }

    public getAttributes(): Map<string, string> {
        return new Map(this.attributes);
    }

    _routeInterface: string = 'Route';
}

export default Route;
