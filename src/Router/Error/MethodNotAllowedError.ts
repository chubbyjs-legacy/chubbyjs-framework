import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RouterError from './RouterError';
import HttpErrorInterface from './HttpErrorInterface';

class MethodNotAllowedError extends RouterError implements HttpErrorInterface {
    private constructor(message: string) {
        super('Method Not Allowed', message, 405);
    }

    public static create(path: string, method: Method, methods: Array<string>): MethodNotAllowedError {
        return new MethodNotAllowedError(
            `Method "${method}" at path "${path}" is not allowed. Must be one of: "${methods.join('", "')}".`,
        );
    }

    _httpErrorInterface: string = 'MethodNotAllowedError';
}

export default MethodNotAllowedError;
