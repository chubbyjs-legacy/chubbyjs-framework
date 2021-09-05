import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import MiddlewareDispatcher from './Middleware/MiddlewareDispatcher';
import MiddlewareDispatcherInterface from './Middleware/MiddlewareDispatcherInterface';
import RouteRequestHandler from './RequestHandler/RouteRequestHandler';

class Application implements RequestHandlerInterface {
    public constructor(
        private middlewares: Array<MiddlewareInterface>,
        private middlewareDispatcher: MiddlewareDispatcherInterface = new MiddlewareDispatcher(),
        private requestHandler: RequestHandlerInterface = new RouteRequestHandler(middlewareDispatcher),
    ) {}

    public handle(request: ServerRequestInterface): ResponseInterface {
        return this.middlewareDispatcher.dispatch(this.middlewares, this.requestHandler, request);
    }
}

export default Application;
