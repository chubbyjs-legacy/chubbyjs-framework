import RouterError from './RouterError';

class RouteGenerationError extends RouterError {
    private constructor(message: string) {
        super(RouteGenerationError.name, message, 3);
    }

    public static create(
        name: string,
        pattern: string,
        attributes: Map<string, string> | undefined,
        error?: Error,
    ): RouteGenerationError {
        let message = `Route generation for route "${name}" with pattern "${pattern}" with attributes "${
            undefined !== attributes ? JSON.stringify(Object.fromEntries(attributes)) : ''
        }" failed.`;

        if (error) {
            message += ` Cause: ${error.message}`;
        }

        return new RouteGenerationError(message);
    }
}

export default RouteGenerationError;
