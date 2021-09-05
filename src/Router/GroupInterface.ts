import RouteInterface from './RouteInterface';

interface GroupInterface {
    getRoutes(): Array<RouteInterface>;
    _groupInterface: string;
}

export const isGroup = (group: unknown): group is GroupInterface => {
    return typeof group === 'object' && null !== group && typeof (group as GroupInterface)._groupInterface === 'string';
};

export default GroupInterface;
