import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import GroupInterface, { isGroup } from './GroupInterface';
import Route from './Route';
import RouteInterface, { PathOptions } from './RouteInterface';

class Group implements GroupInterface {
    private constructor(
        private path: string,
        private children: Array<GroupInterface | RouteInterface>,
        private middlewares: Array<MiddlewareInterface>,
        private pathOptions: PathOptions,
    ) {}

    public static create(
        path: string,
        children: Array<GroupInterface | RouteInterface>,
        middlewares: Array<MiddlewareInterface> = [],
        pathOptions: PathOptions = {},
    ): Group {
        return new Group(path, children, middlewares, pathOptions);
    }

    public getRoutes(): Array<RouteInterface> {
        const routes: Array<RouteInterface> = [];
        this.children.forEach((value) => {
            if (isGroup(value)) {
                value.getRoutes().forEach((route) => {
                    routes.push(this.createRoute(route));
                });
            } else {
                routes.push(this.createRoute(value));
            }
        });

        return routes;
    }

    private createRoute(route: RouteInterface): RouteInterface {
        return Route.create(
            route.getMethod(),
            this.path + route.getPath(),
            route.getName(),
            route.getRequestHandler(),
            [...this.middlewares, ...route.getMiddlewares()],
            { ...this.pathOptions, ...route.getPathOptions() },
        );
    }

    _groupInterface: string = 'Group';
}

export default Group;
