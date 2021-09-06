import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import RouteInterface, { PathOptions } from '../../../src/Router/RouteInterface';

class RouteDouble implements RouteInterface {
    getMethod(): Method {
        throw new Error('Method not implemented.');
    }
    getPath(): string {
        throw new Error('Method not implemented.');
    }
    getName(): string {
        throw new Error('Method not implemented.');
    }
    getRequestHandler(): RequestHandlerInterface {
        throw new Error('Method not implemented.');
    }
    getMiddlewares(): MiddlewareInterface[] {
        throw new Error('Method not implemented.');
    }
    getPathOptions(): PathOptions {
        throw new Error('Method not implemented.');
    }
    withAttributes(attributes: Map<string, string>): this {
        throw new Error('Method not implemented.');
    }
    getAttributes(): Map<string, any> {
        throw new Error('Method not implemented.');
    }
    _routeInterface: string = 'RouteDouble';
}

export default RouteDouble;
