import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';

class LazyMiddleware implements MiddlewareInterface {
    public constructor(private container: ContainerInterface, private id: string) {}

    public async process(
        request: ServerRequestInterface,
        handler: RequestHandlerInterface,
    ): Promise<ResponseInterface> {
        return (await this.container.get<Promise<MiddlewareInterface>>(this.id)).process(request, handler);
    }
}

export default LazyMiddleware;
