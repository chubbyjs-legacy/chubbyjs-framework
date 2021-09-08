import RouterError from './RouterError';
import HttpErrorInterface from './HttpErrorInterface';

class NotFoundError extends RouterError implements HttpErrorInterface {
    private constructor(message: string) {
        super(NotFoundError.name, message, 404);
    }

    public static create(path: string): NotFoundError {
        return new NotFoundError(
            `The page "${path}" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.`,
        );
    }

    _httpErrorInterface: string = 'NotFoundError';
}

export default NotFoundError;
