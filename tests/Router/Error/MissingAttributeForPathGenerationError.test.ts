import { describe, expect, test } from '@jest/globals';
import MissingAttributeForPathGenerationError from '../../../src/Router/Error/MissingAttributeForPathGenerationError';

describe('MissingAttributeForPathGenerationError', () => {
    test('create', () => {
        const routerError = MissingAttributeForPathGenerationError.create('hello', 'name');

        expect(routerError.name).toBe('MissingAttributeForPathGenerationError');
        expect(routerError.message).toBe('Missing attribute "name" while path generation for route: "hello"');
        expect(routerError.code).toBe(3);
    });
});
