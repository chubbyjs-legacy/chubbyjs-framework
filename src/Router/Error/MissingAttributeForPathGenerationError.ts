import RouterError from './RouterError';

class MissingAttributeForPathGenerationError extends RouterError {
    private constructor(message: string) {
        super(MissingAttributeForPathGenerationError.name, message, 3);
    }

    public static create(name: string, attribute: string): MissingAttributeForPathGenerationError {
        return new MissingAttributeForPathGenerationError(
            `Missing attribute "${attribute}" while path generation for route: "${name}"`,
        );
    }
}

export default MissingAttributeForPathGenerationError;
