import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';

class LazyRequestHandler implements RequestHandlerInterface {
    public constructor(private container: ContainerInterface, private id: string) {}

    public async handle(request: ServerRequestInterface): Promise<ResponseInterface> {
        return (await this.container.get<Promise<RequestHandlerInterface>>(this.id)).handle(request);
    }
}

export default LazyRequestHandler;
