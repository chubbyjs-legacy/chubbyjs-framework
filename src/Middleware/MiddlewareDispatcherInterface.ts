import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';

interface MiddlewareDispatcherInterface {
    dispatch(
        middlewares: Array<MiddlewareInterface>,
        handler: RequestHandlerInterface,
        request: ServerRequestInterface,
    ): Promise<ResponseInterface>;
}

export default MiddlewareDispatcherInterface;
