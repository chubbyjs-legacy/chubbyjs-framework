export default interface RouterErrorInterface {
    name: string;
    message: string;
    code: number;
    stack?: string;
    _routerErrorInterface: string;
}

export const isRouteError = (route: unknown): route is RouterErrorInterface => {
    return (
        typeof route === 'object' &&
        null !== route &&
        typeof (route as RouterErrorInterface)._routerErrorInterface === 'string'
    );
};
