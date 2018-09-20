const express = require('express');
var rp = require('request-promise-native');

const svc = express();

svc.get('/', (req, res) => {

    console.log('Processing request...');

    const pb = rp({
        uri: 'http://serviceb:3000',
        resolveWithFullResponse: true
    });

    const pc = rp({
        uri: 'http://servicec:3000',
        resolveWithFullResponse: true
    })

    Promise.all([pb, pc])
        .then((values) => {
            res
                .set('X-API-Version', process.env.SERVICE_VERSION)
                .json({
                    version: process.env.SERVICE_VERSION
                });
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message
            });
        });
});

svc.listen(3000, () => console.log('Service A running on port 3000'));

const probe = express();

probe.get('/health', (req, res) => {
    res.json({
        status: 'Service A is healthy'
    });
});

probe.listen(3003, () => console.log('Service A health check running on port 3003'));