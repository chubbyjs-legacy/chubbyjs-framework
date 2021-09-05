import MockByCalls from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import { Method } from '@chubbyjs/psr-http-message/dist/RequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import { describe, expect, test } from '@jest/globals';
import Route from '../../src/Router/Route';
import Routes from '../../src/Router/Routes';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';

const mockByCalls = new MockByCalls();

describe('Routes', () => {
    test('getRoutesByName', () => {
        const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble);

        const petList = Route.create(Method.GET, '', 'pet_list', handler);

        const petCreate = Route.create(Method.POST, '', 'pet_create', handler);

        const routes = new Routes([petList, petCreate]);

        const routesByName = routes.getRoutesByName();

        expect(routesByName.get('pet_list')).toBe(petList);
        expect(routesByName.get('pet_create')).toBe(petCreate);
    });
});
