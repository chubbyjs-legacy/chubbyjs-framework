import { describe, expect, test } from '@jest/globals';
import RouterError from '../../src/Router/RouterError';

describe('RouterError', () => {
    test('constructor with', () => {
        const routerError = new (class extends RouterError {
            public constructor() {
                super('name', 'message');
            }
        })();

        expect(routerError.name).toBe('name');
        expect(routerError.message).toBe('message');
        expect(routerError.code).toBe(500);
    });

    test('constructor without defaults', () => {
        const routerError = new (class extends RouterError {
            public constructor() {
                super('name', 'message', 999);
            }
        })();

        expect(routerError.name).toBe('name');
        expect(routerError.message).toBe('message');
        expect(routerError.code).toBe(999);
    });
});
