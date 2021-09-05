import RouteInterface from './RouteInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';

interface RouteMatcherInterface {
    match(request: ServerRequestInterface): RouteInterface;
}

export default RouteMatcherInterface;
