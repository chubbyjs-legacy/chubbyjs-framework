import { describe, expect, test } from '@jest/globals';
import { isHttpError } from '../../../src/Router/Error/HttpErrorInterface';

describe('HttpErrorInterface', () => {
    describe('isHttpError', () => {
        [
            { name: 'group', value: { _httpErrorInterface: 'HttpError' }, toBe: true },
            { name: 'object', value: {}, toBe: false },
            { name: 'string', value: 'example', toBe: false },
            { name: 'undefined', value: undefined, toBe: false },
            { name: 'null', value: null, toBe: false },
        ].forEach(({ name, value, toBe }) => {
            test('error is ' + name, () => {
                expect(isHttpError(value)).toBe(toBe);
            });
        });
    });
});
