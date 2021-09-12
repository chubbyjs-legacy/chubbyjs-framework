import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import { describe, expect, test } from '@jest/globals';
import MethodNotAllowedError from '../../../src/Router/Error/MethodNotAllowedError';

describe('MethodNotAllowedError', () => {
    test('create', () => {
        const routerError = MethodNotAllowedError.create('/path', Method.POST, [Method.GET, Method.HEAD]);

        expect(routerError.name).toBe('Method Not Allowed');
        expect(routerError.message).toBe(
            'Method "POST" at path "/path" is not allowed. Must be one of: "GET", "HEAD".',
        );
        expect(routerError.code).toBe(405);
    });
});
