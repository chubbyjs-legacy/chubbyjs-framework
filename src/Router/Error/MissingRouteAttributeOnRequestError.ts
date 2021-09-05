import RouteMatcherMiddleware from '../../Middleware/RouteMatcherMiddleware';
import RouterError from '../RouterError';

class MissingRouteAttributeOnRequestError extends RouterError {
    private constructor(message: string) {
        super(MissingRouteAttributeOnRequestError.name, message, 500);
    }

    public static create(route: unknown): MissingRouteAttributeOnRequestError {
        return new MissingRouteAttributeOnRequestError(
            `Request attribute "route" missing or wrong type "${typeof route}", please add the "${
                RouteMatcherMiddleware.name
            }" middleware.`,
        );
    }
}

export default MissingRouteAttributeOnRequestError;
