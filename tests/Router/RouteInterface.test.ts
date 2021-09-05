import { describe, expect, test } from '@jest/globals';
import { isRoute } from '../../src/Router/RouteInterface';

describe('RouteInterface', () => {
    describe('isRoute', () => {
        [
            { name: 'group', value: { _groupInterface: 'GroupDouble' }, toBe: false },
            { name: 'route', value: { _routeInterface: 'RouteDouble' }, toBe: true },
            { name: 'object', value: {}, toBe: false },
            { name: 'string', value: 'example', toBe: false },
            { name: 'undefined', value: undefined, toBe: false },
        ].forEach(({ name, value, toBe }) => {
            test('route is ' + name, () => {
                expect(isRoute(value)).toBe(toBe);
            });
        });
    });
});
