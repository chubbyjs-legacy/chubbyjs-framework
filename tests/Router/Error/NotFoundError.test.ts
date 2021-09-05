import { describe, expect, test } from '@jest/globals';
import NotFoundError from '../../../src/Router/Error/NotFoundError';

describe('NotFoundError', () => {
    test('constructor', () => {
        const routerError = NotFoundError.create('/path');

        expect(routerError.name).toBe('NotFoundError');
        expect(routerError.message).toBe(
            'The page "/path" you are looking for could not be found. Check the address bar to ensure your URL is spelled correctly.',
        );
        expect(routerError.code).toBe(404);
    });
});
