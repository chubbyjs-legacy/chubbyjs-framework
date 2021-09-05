import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import MiddlewareDispatcherInterface from './MiddlewareDispatcherInterface';
import MiddlewareRequestHandler from './MiddlewareRequestHandler';

class MiddlewareDispatcher implements MiddlewareDispatcherInterface {
    public dispatch(
        middlewares: Array<MiddlewareInterface>,
        handler: RequestHandlerInterface,
        request: ServerRequestInterface,
    ): ResponseInterface {
        if (0 === middlewares.length) {
            return handler.handle(request);
        }

        const middlewaresToDispatch = [...middlewares];

        middlewaresToDispatch.reverse();

        const firstMiddleware = middlewaresToDispatch.pop() as MiddlewareInterface;

        middlewaresToDispatch.forEach((middleware: MiddlewareInterface) => {
            handler = new MiddlewareRequestHandler(middleware, handler);
        });

        return firstMiddleware.process(request, handler);
    }
}

export default MiddlewareDispatcher;
