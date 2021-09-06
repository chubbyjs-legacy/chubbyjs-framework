import { describe, expect, test } from '@jest/globals';
import { isGroup } from '../../src/Router/GroupInterface';

describe('GroupInterface', () => {
    describe('isGroup', () => {
        [
            { name: 'group', value: { _groupInterface: 'GroupDouble' }, toBe: true },
            { name: 'route', value: { _routeInterface: 'RouteDouble' }, toBe: false },
            { name: 'object', value: {}, toBe: false },
            { name: 'string', value: 'example', toBe: false },
            { name: 'undefined', value: undefined, toBe: false },
            { name: 'null', value: null, toBe: false },
        ].forEach(({ name, value, toBe }) => {
            test('group is ' + name, () => {
                expect(isGroup(value)).toBe(toBe);
            });
        });
    });
});
