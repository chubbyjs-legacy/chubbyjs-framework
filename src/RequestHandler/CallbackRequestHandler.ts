import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';

class CallbackRequestHandler implements RequestHandlerInterface {
    public constructor(private callback: (request: ServerRequestInterface) => Promise<ResponseInterface>) {}

    public async handle(request: ServerRequestInterface): Promise<ResponseInterface> {
        return this.callback(request);
    }
}

export default CallbackRequestHandler;
