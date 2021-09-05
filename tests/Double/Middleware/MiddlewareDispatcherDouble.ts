import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import MiddlewareDispatcherInterface from '../../../src/Middleware/MiddlewareDispatcherInterface';

class MiddlewareDispatcherDouble implements MiddlewareDispatcherInterface {
    dispatch(
        middlewares: MiddlewareInterface[],
        handler: RequestHandlerInterface,
        request: ServerRequestInterface,
    ): ResponseInterface {
        throw new Error('Method not implemented.');
    }
}

export default MiddlewareDispatcherDouble;
