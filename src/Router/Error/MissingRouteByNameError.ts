import RouterError from './RouterError';

class MissingRouteByNameError extends RouterError {
    private constructor(message: string) {
        super('Missing Route By Name', message, 2);
    }

    public static create(name: string): MissingRouteByNameError {
        return new MissingRouteByNameError(`Missing route: "${name}"`);
    }
}

export default MissingRouteByNameError;
