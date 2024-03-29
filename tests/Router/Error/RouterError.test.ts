import { describe, expect, test } from '@jest/globals';
import RouterError from '../../../src/Router/Error/RouterError';

describe('RouterError', () => {
    test('constructor', () => {
        const routerError = new (class extends RouterError {
            public constructor(name: string, message: string, code: number) {
                super(name, message, code);
            }
        })('name', 'message', 999);

        expect(routerError).toBeInstanceOf(Error);
        expect(routerError.name).toBe('name');
        expect(routerError.message).toBe('message');
        expect(routerError.code).toBe(999);
    });
});
