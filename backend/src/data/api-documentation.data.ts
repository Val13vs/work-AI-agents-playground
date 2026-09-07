import { ApiDocumentation } from '../models/api-documentation.model.js';

export const apiDocumentation: ApiDocumentation[] = [
    {
        resource: 'Locations',
        description:
            'API used for retrieving and searching location records.',
        endpoints: [
            {
                method: 'GET',
                path: '/api/locations',
                description: 'Returns all available locations.',
                responseExample: [
                    {
                        id: 1,
                        name: 'Sofia'
                    },
                    {
                        id: 2,
                        name: 'Plovdiv'
                    }
                ]
            },
            {
                method: 'GET',
                path: '/api/locations/:id',
                description: 'Returns a single location by its identifier.',
                responseExample: {
                    id: 1,
                    name: 'Sofia'
                }
            },
            {
                method: 'POST',
                path: '/api/locations/search',
                description:
                    'Searches locations using filters and server-side pagination.',
                requestExample: {
                    name: 'Sofia',
                    pageNumber: 1,
                    pageSize: 20
                },
                responseExample: {
                    items: [
                        {
                            id: 1,
                            name: 'Sofia'
                        }
                    ],
                    totalCount: 1
                }
            }
        ]
    },

    {
        resource: 'Events',
        description:
            'API used for retrieving and searching application events.',
        endpoints: [
            {
                method: 'GET',
                path: '/api/events/:id',
                description: 'Returns a single event by identifier.',
                responseExample: {
                    id: 10,
                    name: 'System Login',
                    createdAt: '2026-09-07T10:00:00'
                }
            },
            {
                method: 'POST',
                path: '/api/events/search',
                description:
                    'Searches events using server-side filtering and pagination.',
                requestExample: {
                    pageNumber: 1,
                    pageSize: 20,
                    name: ''
                },
                responseExample: {
                    items: [],
                    totalCount: 0
                }
            }
        ]
    },

    {
        resource: 'Users',
        description:
            'API used for managing application users.',
        endpoints: [
            {
                method: 'GET',
                path: '/api/users/:id',
                description: 'Returns a user by identifier.',
                responseExample: {
                    id: 15,
                    firstName: 'Ivan',
                    lastName: 'Ivanov'
                }
            },
            {
                method: 'POST',
                path: '/api/users',
                description: 'Creates a new user.',
                requestExample: {
                    firstName: 'Ivan',
                    lastName: 'Ivanov'
                },
                responseExample: {
                    id: 15,
                    firstName: 'Ivan',
                    lastName: 'Ivanov'
                }
            },
            {
                method: 'PUT',
                path: '/api/users/:id',
                description: 'Updates an existing user.',
                requestExample: {
                    firstName: 'Ivan',
                    lastName: 'Petrov'
                }
            }
        ]
    }
];