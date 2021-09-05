import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RouteInterface from '../../../src/Router/RouteInterface';
import RouteMatcherInterface from '../../../src/Router/RouteMatcherInterface';

class RouteMatcherDouble implements RouteMatcherInterface {
    match(request: ServerRequestInterface): RouteInterface {
        throw new Error('Method not implemented.');
    }
}

export default RouteMatcherDouble;
