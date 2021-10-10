import { describe, expect, test } from '@jest/globals';
import RouteGenerationError from '../../../src/Router/Error/RouteGenerationError';

describe('RouteGenerationError', () => {
    describe('create', () => {
        test('create without error', () => {
            const routerError = RouteGenerationError.create('hello', '/hello/:name([a-z]+)', undefined);

            expect(routerError.name).toBe('Route Generation');
            expect(routerError.message).toBe(
                'Route generation for route "hello" with path "/hello/:name([a-z]+)" with attributes "" failed.',
            );
            expect(routerError.code).toBe(3);
        });

        test('create with error', () => {
            const error = new TypeError('Name attribute value does not match the path.');

            const routerError = RouteGenerationError.create(
                'hello',
                '/hello/:name([a-z]+)',
                new Map([['name', 'firstname-lastname']]),
                error,
            );

            expect(routerError.name).toBe('Route Generation');
            expect(routerError.message).toBe(
                'Route generation for route "hello" with path "/hello/:name([a-z]+)" with attributes "{"name":"firstname-lastname"}" failed. Cause: Name attribute value does not match the path.',
            );
            expect(routerError.code).toBe(3);
        });
    });
});
