import RouteInterface from './RouteInterface';
import RoutesInterface from './RoutesInterface';

class Routes implements RoutesInterface {
    private routesByName: Map<string, RouteInterface>;

    public constructor(routes: Array<RouteInterface>) {
        this.routesByName = new Map(routes.map((route) => [route.getName(), route]));
    }

    public getRoutesByName(): Map<string, RouteInterface> {
        return this.routesByName;
    }
}

export default Routes;
