const express = require('express');
var rp = require('request-promise-native');

const svc = express();

svc.get('/', (req, res) => {

    console.log('Processing request...');

    var options = {
        uri: 'http://servicec:3000',
        resolveWithFullResponse: true
    };

    rp(options)
        .then((response) => {
            console.log(`Upstream call to Service C on '${options.uri}' returned '${response.statusCode}'`);
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

svc.listen(3000, () => console.log('Service B running on port 3000'));

const probe = express();

probe.get('/health', (req, res) => {
    res.json({
        status: 'Service B is healthy'
    });
});

probe.listen(3003, () => console.log('Service B health check running on port 3003'));