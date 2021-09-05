import RouterError from '../RouterError';

class NotFoundError extends RouterError {
    private constructor(message: string) {
        super(NotFoundError.name, message, 404);
    }

    public static create(path: string): NotFoundError {
        return new NotFoundError(
            `The page "${path}" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.`,
        );
    }
}

export default NotFoundError;
