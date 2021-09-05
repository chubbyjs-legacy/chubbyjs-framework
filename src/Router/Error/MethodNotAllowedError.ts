import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RouterError from '../RouterError';

class MethodNotAllowedError extends RouterError {
    private constructor(message: string) {
        super(MethodNotAllowedError.name, message, 405);
    }

    public static create(path: string, method: Method, methods: Array<string>): MethodNotAllowedError {
        return new MethodNotAllowedError(
            `Method "${method}" at path "${path}" is not allowed. Must be one of: "${methods.join('", "')}".`,
        );
    }
}

export default MethodNotAllowedError;
