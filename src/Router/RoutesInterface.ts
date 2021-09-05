import RouteInterface from './RouteInterface';

interface RoutesInterface {
    getRoutesByName(): Map<string, RouteInterface>;
}

export default RoutesInterface;
