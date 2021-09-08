import RouteMatcherMiddleware from '../../Middleware/RouteMatcherMiddleware';
import RouterError from './RouterError';
import HttpErrorInterface from './HttpErrorInterface';

class MissingRouteAttributeOnRequestError extends RouterError implements HttpErrorInterface {
    private constructor(message: string) {
        super(MissingRouteAttributeOnRequestError.name, message, 1);
    }

    public static create(route: unknown): MissingRouteAttributeOnRequestError {
        return new MissingRouteAttributeOnRequestError(
            `Request attribute "route" missing or wrong type "${typeof route}", please add the "${
                RouteMatcherMiddleware.name
            }" middleware.`,
        );
    }

    _httpErrorInterface: string = 'MissingRouteAttributeOnRequestError';
}

export default MissingRouteAttributeOnRequestError;
