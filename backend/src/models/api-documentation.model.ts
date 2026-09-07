export type ApiMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE';

export interface ApiEndpoint {
    method: ApiMethod;
    path: string;
    description: string;
    requestExample?: unknown;
    responseExample?: unknown;
}

export interface ApiDocumentation {
    resource: string;
    description: string;
    endpoints: ApiEndpoint[];
}