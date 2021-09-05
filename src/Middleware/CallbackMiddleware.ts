import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';

class CallbackMiddleware implements MiddlewareInterface {
    public constructor(
        private callback: (request: ServerRequestInterface, handler: RequestHandlerInterface) => ResponseInterface,
    ) {}

    public process(request: ServerRequestInterface, handler: RequestHandlerInterface): ResponseInterface {
        return this.callback(request, handler);
    }
}

export default CallbackMiddleware;
