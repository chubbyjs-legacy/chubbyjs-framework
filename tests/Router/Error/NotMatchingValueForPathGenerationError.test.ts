import { describe, expect, test } from '@jest/globals';
import NotMatchingValueForPathGenerationError from '../../../src/Router/Error/NotMatchingValueForPathGenerationError';

describe('NotMatchingValueForPathGenerationError', () => {
    test('create', () => {
        const routerError = NotMatchingValueForPathGenerationError.create(
            'hello',
            'name',
            'firstname-lastname',
            '/hello/:name([a-z]+)',
        );

        expect(routerError.name).toBe('NotMatchingValueForPathGenerationError');
        expect(routerError.message).toBe(
            'Not matching value "firstname-lastname" with pattern "/hello/:name([a-z]+)" on attribute "name" while path generation for route: "hello"',
        );
        expect(routerError.code).toBe(4);
    });
});
