import { describe, expect, test } from '@jest/globals';
import MissingRouteAttributeOnRequestError from '../../../src/Router/Error/MissingRouteAttributeOnRequestError';

describe('MissingRouteAttributeOnRequestError', () => {
    test('create', () => {
        const routerError = MissingRouteAttributeOnRequestError.create(undefined);

        expect(routerError.name).toBe('Missing Route Attribute On Request');
        expect(routerError.message).toBe(
            'Request attribute "route" missing or wrong type "undefined", please add the "RouteMatcherMiddleware" middleware.',
        );
        expect(routerError.code).toBe(1);
    });
});
