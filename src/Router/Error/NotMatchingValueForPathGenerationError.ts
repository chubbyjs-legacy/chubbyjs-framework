import RouterError from './RouterError';

class NotMatchingValueForPathGenerationError extends RouterError {
    private constructor(message: string) {
        super(NotMatchingValueForPathGenerationError.name, message, 4);
    }

    public static create(
        name: string,
        attribute: string,
        value: string,
        pattern: string,
    ): NotMatchingValueForPathGenerationError {
        return new NotMatchingValueForPathGenerationError(
            `Not matching value "${value}" with pattern "${pattern}" on attribute "${attribute}" while path generation for route: "${name}"`,
        );
    }
}

export default NotMatchingValueForPathGenerationError;
