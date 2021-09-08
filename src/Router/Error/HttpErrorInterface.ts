export default interface HttpErrorInterface {
    name: string;
    message: string;
    code: number;
    stack?: string;
    _httpErrorInterface: string;
}

export const isHttpError = (route: unknown): route is HttpErrorInterface => {
    return (
        typeof route === 'object' &&
        null !== route &&
        typeof (route as HttpErrorInterface)._httpErrorInterface === 'string'
    );
};
