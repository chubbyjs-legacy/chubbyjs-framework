import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RouterError from './RouterError';
import RouterErrorInterface from './RouterErrorInterface';

class MethodNotAllowedError extends RouterError implements RouterErrorInterface {
    private constructor(message: string) {
        super(MethodNotAllowedError.name, message, 405);
    }

    public static create(path: string, method: Method, methods: Array<string>): MethodNotAllowedError {
        return new MethodNotAllowedError(
            `Method "${method}" at path "${path}" is not allowed. Must be one of: "${methods.join('", "')}".`,
        );
    }

    _routerErrorInterface: string = 'MethodNotAllowedError';
}

export default MethodNotAllowedError;
