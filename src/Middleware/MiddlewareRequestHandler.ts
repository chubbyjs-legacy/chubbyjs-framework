import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';

class MiddlewareRequestHandler implements RequestHandlerInterface {
    public constructor(private middleware: MiddlewareInterface, private handler: RequestHandlerInterface) {}

    public async handle(request: ServerRequestInterface): Promise<ResponseInterface> {
        return this.middleware.process(request, this.handler);
    }
}

export default MiddlewareRequestHandler;
