const express = require('express');

const svc = express();

svc.get('/', (req, res) => {
    console.log('Processing request...');

    res
        .set('X-API-Version', process.env.SERVICE_VERSION)
        .json({
            version: process.env.SERVICE_VERSION
        });
});

svc.listen(3000, () => console.log('Service D running on port 3000'));

const probe = express();

probe.get('/health', (req, res) => {
    res.json({
        status: 'Service D is healthy'
    });
});

probe.listen(3003, () => console.log('Service D health check running on port 3003'));