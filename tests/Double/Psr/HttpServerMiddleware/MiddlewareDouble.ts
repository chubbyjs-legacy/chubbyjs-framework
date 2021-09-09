import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';

class MiddlewareDouble implements MiddlewareInterface {
    async process(request: ServerRequestInterface, handler: RequestHandlerInterface): Promise<ResponseInterface> {
        throw new Error('Method not implemented.');
    }
}

export default MiddlewareDouble;
