import MockByCalls from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import MiddlewareInterface from '@chubbyjs/psr-http-server-middleware/dist/MiddlewareInterface';
import { describe, expect, test } from '@jest/globals';
import Route from '../../src/Router/Route';
import Group from '../../src/Router/Group';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';
import MiddlewareDouble from '../Double/Psr/HttpServerMiddleware/MiddlewareDouble';

const mockByCalls = new MockByCalls();

describe('Group', () => {
    describe('create', () => {
        test('with defaults', () => {
            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);
            const middleware = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble);

            const group = Group.create('/api', [
                Route.create(Method.GET, '/ping', 'ping', handler, [middleware], new Map([['option', 'value']])),
                Group.create('/pets', [
                    Route.create(Method.GET, '', 'pet_list', handler, [middleware], new Map([['option', 'value']])),
                    Route.create(Method.POST, '', 'pet_create', handler, [middleware], new Map([['option', 'value']])),
                ]),
            ]);

            expect(group._groupInterface).toBe('Group');

            const routes = group.getRoutes();

            expect(routes.length).toBe(3);

            expect(routes[0].getMethod()).toBe(Method.GET);
            expect(routes[0].getPath()).toBe('/api/ping');
            expect(routes[0].getName()).toBe('ping');
            expect(routes[0].getRequestHandler()).toBe(handler);
            expect(routes[0].getMiddlewares()).toEqual([middleware]);
            expect(routes[0].getPathOptions()).toEqual(new Map([['option', 'value']]));
            expect(routes[0].getAttributes()).toEqual(new Map());

            expect(routes[1].getMethod()).toBe(Method.GET);
            expect(routes[1].getPath()).toBe('/api/pets');
            expect(routes[1].getName()).toBe('pet_list');
            expect(routes[1].getRequestHandler()).toBe(handler);
            expect(routes[1].getMiddlewares()).toEqual([middleware]);
            expect(routes[1].getPathOptions()).toEqual(new Map([['option', 'value']]));
            expect(routes[1].getAttributes()).toEqual(new Map());

            expect(routes[2].getMethod()).toBe(Method.POST);
            expect(routes[2].getPath()).toBe('/api/pets');
            expect(routes[2].getName()).toBe('pet_create');
            expect(routes[2].getRequestHandler()).toBe(handler);
            expect(routes[2].getMiddlewares()).toEqual([middleware]);
            expect(routes[2].getPathOptions()).toEqual(new Map([['option', 'value']]));
            expect(routes[2].getAttributes()).toEqual(new Map());
        });

        test('without defaults', () => {
            const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);
            const middleware1 = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble);
            const middleware2 = mockByCalls.create<MiddlewareInterface>(MiddlewareDouble);

            const group = Group.create(
                '/api',
                [
                    Route.create(Method.GET, '/ping', 'ping', handler, [middleware1], new Map([['option', 'value']])),
                    Group.create('/pets', [
                        Route.create(
                            Method.GET,
                            '',
                            'pet_list',
                            handler,
                            [middleware1],
                            new Map([['option', 'value']]),
                        ),
                        Route.create(
                            Method.POST,
                            '',
                            'pet_create',
                            handler,
                            [middleware1],
                            new Map([['option', 'value']]),
                        ),
                    ]),
                ],
                [middleware2],
                new Map([['option2', 'value2']]),
            );

            expect(group._groupInterface).toBe('Group');

            const routes = group.getRoutes();

            expect(routes.length).toBe(3);

            expect(routes[0].getMethod()).toBe(Method.GET);
            expect(routes[0].getPath()).toBe('/api/ping');
            expect(routes[0].getName()).toBe('ping');
            expect(routes[0].getRequestHandler()).toBe(handler);
            expect(routes[0].getMiddlewares()).toEqual([middleware2, middleware1]);
            expect(routes[0].getPathOptions()).toEqual(
                new Map([
                    ['option', 'value'],
                    ['option2', 'value2'],
                ]),
            );
            expect(routes[0].getAttributes()).toEqual(new Map());

            expect(routes[1].getMethod()).toBe(Method.GET);
            expect(routes[1].getPath()).toBe('/api/pets');
            expect(routes[1].getName()).toBe('pet_list');
            expect(routes[1].getRequestHandler()).toBe(handler);
            expect(routes[1].getMiddlewares()).toEqual([middleware2, middleware1]);
            expect(routes[1].getPathOptions()).toEqual(
                new Map([
                    ['option', 'value'],
                    ['option2', 'value2'],
                ]),
            );
            expect(routes[1].getAttributes()).toEqual(new Map());

            expect(routes[2].getMethod()).toBe(Method.POST);
            expect(routes[2].getPath()).toBe('/api/pets');
            expect(routes[2].getName()).toBe('pet_create');
            expect(routes[2].getRequestHandler()).toBe(handler);
            expect(routes[2].getMiddlewares()).toEqual([middleware2, middleware1]);
            expect(routes[2].getPathOptions()).toEqual(
                new Map([
                    ['option', 'value'],
                    ['option2', 'value2'],
                ]),
            );
            expect(routes[2].getAttributes()).toEqual(new Map());
        });
    });
});
