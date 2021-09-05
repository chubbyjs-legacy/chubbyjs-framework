import GroupInterface from '../../../src/Router/GroupInterface';
import RouteInterface from '../../../src/Router/RouteInterface';

class GroupDouble implements GroupInterface {
    getRoutes(): RouteInterface[] {
        throw new Error('Method not implemented.');
    }
    _groupInterface: string = 'GroupDouble';
}

export default GroupDouble;
