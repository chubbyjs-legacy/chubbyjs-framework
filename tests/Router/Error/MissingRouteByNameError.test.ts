import { describe, expect, test } from '@jest/globals';
import MissingRouteByNameError from '../../../src/Router/Error/MissingRouteByNameError';

describe('MissingRouteByNameError', () => {
    test('create', () => {
        const routerError = MissingRouteByNameError.create('hello');

        expect(routerError.name).toBe('MissingRouteByNameError');
        expect(routerError.message).toBe('Missing route: "hello"');
        expect(routerError.code).toBe(1);
    });
});
