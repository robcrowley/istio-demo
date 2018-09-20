const express = require('express');
var rp = require('request-promise-native');

const svc = express();

svc.get('/', (req, res) => {
    console.log('Processing request...');
    console.log(`Host Header: ${req.get('Host')}`);

    if (process.env.SERVICE_VERSION === "2.0.0") {

        var options = {
            uri: 'http://serviced:3000',
            resolveWithFullResponse: true
        };

        rp(options)
            .then((response) => {
                console.log(`Upstream call to Service D returned '${response.statusCode}'`);
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
    } else if (process.env.SERVICE_VERSION === "3.0.0") {
        res.status(503).json({
            error: 'Transient server issue. Best to try again later'
        });
    } else {
        res
            .set('X-API-Version', process.env.SERVICE_VERSION)
            .json({
                version: process.env.SERVICE_VERSION
            });
    }
});

svc.listen(3000, () => console.log('Service C running on port 3000'));

const probe = express();

probe.get('/health', (req, res) => {
    res.json({
        status: 'Service C is healthy'
    });
});

probe.listen(3003, () => console.log('Service C health check running on port 3003'));