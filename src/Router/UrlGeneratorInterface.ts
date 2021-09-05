import ServerRequestInterface, { QueryParams } from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';

interface UrlGeneratorInterface {
    generateUrl(
        request: ServerRequestInterface,
        name: string,
        attributes: Map<string, any>,
        queryParams: QueryParams,
    ): string;

    generatePath(name: string, attributes: Map<string, any>, queryParams: QueryParams): string;
}

export default UrlGeneratorInterface;
