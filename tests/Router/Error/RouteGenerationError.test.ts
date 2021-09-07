import { describe, expect, test } from '@jest/globals';
import RouteGenerationError from '../../../src/Router/Error/RouteGenerationError';

describe('RouteGenerationError', () => {
    describe('create', () => {
        test('create without error', () => {
            const routerError = RouteGenerationError.create('hello', '/hello/:name([a-z]+)', undefined);

            expect(routerError.name).toBe('RouteGenerationError');
            expect(routerError.message).toBe(
                'Route generation for route "hello" with pattern "/hello/:name([a-z]+)" with attributes "" failed.',
            );
            expect(routerError.code).toBe(2);
        });

        test('create with error', () => {
            const error = new TypeError('Name attribute value does not match the pattern.');

            const routerError = RouteGenerationError.create(
                'hello',
                '/hello/:name([a-z]+)',
                new Map([['name', 'firstname-lastname']]),
                error,
            );

            expect(routerError.name).toBe('RouteGenerationError');
            expect(routerError.message).toBe(
                'Route generation for route "hello" with pattern "/hello/:name([a-z]+)" with attributes "{"name":"firstname-lastname"}" failed. Cause: Name attribute value does not match the pattern.',
            );
            expect(routerError.code).toBe(2);
        });
    });
});
