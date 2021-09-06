import MockByCalls from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import { describe, expect, test } from '@jest/globals';
import Route from '../../src/Router/Route';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import MiddlewareDouble from '../Double/Psr/HttpServerMiddleware/MiddlewareDouble';

const mockByCalls = new MockByCalls();

describe('Route', () => {
    describe('create', () => {
        test('with defaults', () => {
            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            const route = Route.create(Method.GET, '/', 'home', handler);

            expect(route.getMethod()).toBe(Method.GET);
            expect(route.getPath()).toBe('/');
            expect(route.getName()).toBe('home');
            expect(route.getRequestHandler()).toBe(handler);
            expect(route.getMiddlewares()).toEqual([]);
            expect(route.getPathOptions()).toEqual({});
            expect(route.getAttributes()).toEqual(new Map());

            expect(route._routeInterface).toBe('Route');
        });

        test('without defaults', () => {
            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);
            const middleware = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble);

            const route = Route.create(Method.GET, '/', 'home', handler, [middleware], { option: 'value' });

            const middlewares = route.getMiddlewares();
            middlewares.push(middleware);

            const pathOptions = route.getPathOptions();
            pathOptions.option2 = 'value2';

            expect(route.getMethod()).toBe(Method.GET);
            expect(route.getPath()).toBe('/');
            expect(route.getName()).toBe('home');
            expect(route.getRequestHandler()).toBe(handler);
            expect(route.getMiddlewares()).toEqual([middleware]);
            expect(route.getPathOptions()).toEqual({ option: 'value' });
            expect(route.getAttributes()).toEqual(new Map());

            expect(route._routeInterface).toBe('Route');

            const routeWithAttributes = route.withAttributes(new Map([['attribute', 'value']]));

            expect(route).not.toBe(routeWithAttributes);

            expect(routeWithAttributes.getMethod()).toBe(Method.GET);
            expect(routeWithAttributes.getPath()).toBe('/');
            expect(routeWithAttributes.getName()).toBe('home');
            expect(routeWithAttributes.getRequestHandler()).toBe(handler);
            expect(routeWithAttributes.getMiddlewares()).toEqual([middleware]);
            expect(routeWithAttributes.getPathOptions()).toEqual({ option: 'value' });
            expect(routeWithAttributes.getAttributes()).toEqual(new Map([['attribute', 'value']]));

            expect(routeWithAttributes._routeInterface).toBe('Route');
        });
    });

    [
        { method: Method.DELETE },
        { method: Method.GET },
        { method: Method.HEAD },
        { method: Method.OPTIONS },
        { method: Method.PATCH },
        { method: Method.POST },
        { method: Method.PUT },
    ].forEach(({ method }) => {
        test(method, () => {
            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

            // @ts-ignore
            const route = Route[method.toLowerCase()]('/', 'home', handler);

            expect(route.getMethod()).toBe(method);
            expect(route.getPath()).toBe('/');
            expect(route.getName()).toBe('home');
            expect(route.getRequestHandler()).toBe(handler);
            expect(route.getMiddlewares()).toEqual([]);
            expect(route.getPathOptions()).toEqual({});
        });
    });
});
