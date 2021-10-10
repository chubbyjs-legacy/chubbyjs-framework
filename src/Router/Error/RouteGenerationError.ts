import RouterError from './RouterError';

class RouteGenerationError extends RouterError {
    private constructor(message: string) {
        super('Route Generation', message, 3);
    }

    public static create(
        name: string,
        path: string,
        attributes: Map<string, string> | undefined,
        error?: Error,
    ): RouteGenerationError {
        return new RouteGenerationError(
            `Route generation for route "${name}" with path "${path}" with attributes "${
                undefined !== attributes ? JSON.stringify(Object.fromEntries(attributes)) : ''
            }" failed.${error ? ' Cause: ' + error.message : ''}`,
        );
    }
}

export default RouteGenerationError;
