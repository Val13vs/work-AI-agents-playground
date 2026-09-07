export const tickets = [
    {
        id: 'DEV-101',
        title: 'Locations Search',
        description: 'Implement a search page for locations using the Locations API.',
        status: 'IN_PROGRESS',
        requirements: [
            'Search locations by name',
            'Use server-side pagination',
            'Default page size should be 20',
            'Allow users to clear all filters',
            'Restore filters after returning to the page'
        ],
        relatedApi: 'Locations'
    },
    {
        id: 'DEV-102',
        title: 'Events Pagination',
        description: 'Add server-side pagination to the Events page.',
        status: 'OPEN',
        requirements: [
            'Use lazy loading',
            'Support page size selection',
            'Restore the current page after navigation',
            'Display the total number of records'
        ],
        relatedApi: 'Events'
    },
    {
        id: 'DEV-103',
        title: 'User Form Validation',
        description: 'Improve validation rules in the user management form.',
        status: 'OPEN',
        requirements: [
            'Required fields must display validation messages',
            'Names must not contain digits',
            'Values must not start or end with whitespace',
            'Maximum name length is 200 characters'
        ],
        relatedApi: 'Users'
    }
];
//# sourceMappingURL=tickets.data.js.map