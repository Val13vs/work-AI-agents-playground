import { Router } from 'express';

import { apiDocumentation } from '../data/api.documentation.data.js';

const router = Router();

router.get('/', (_req, res) => {
    res.json(apiDocumentation);
});

router.get('/:resource', (req, res) => {
    const resourceName = req.params.resource;

    const documentation = apiDocumentation.find(
        item =>
            item.resource.toLowerCase() === resourceName.toLowerCase()
    );

    if (!documentation) {
        res.status(404).json({
            message: `API documentation for ${resourceName} was not found`
        });

        return;
    }

    res.json(documentation);
});

export default router;