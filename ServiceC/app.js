const fastify = require('fastify')
const fetch = require('node-fetch')
const hyperid = require('hyperid')

const service = fastify({ logger: true, genReqId: hyperid() });

service.get('/', async (request, reply) => {
    service.log.info(`Hostname: ${request.hostname}`);

    if (process.env.SERVICE_VERSION === "2.0.0") {

        const pc = await fetch('http://serviced:3000')

        service.log.info(`Upstream call to Service D returned '${pc.status}'`);

        if (pc.ok) {
            reply
                .header('X-API-Version', process.env.SERVICE_VERSION)
                .send({ version: process.env.SERVICE_VERSION });
        } else {
            reply.code(500).send({ error: `Upstream call to Service D failed` });
        }
    } else if (process.env.SERVICE_VERSION === "3.0.0") {
        reply.code(500).send({ error: 'Transient server issue. Best to try again later' });
    } else {
        reply
            .header('X-API-Version', process.env.SERVICE_VERSION)
            .send({ version: process.env.SERVICE_VERSION });
    }
});

const startService = async (service, port) => {
    try {
        await service.listen(port, '0.0.0.0')
        service.log.info(`server listening on ${service.server.address().port}`)
    } catch (err) {
        service.log.error(err)
        process.exit(1)
    }
}

startService(service, 3000)

const probe = fastify();

probe.get('/health', async (request, reply) => ({ status: 'Service C is healthy' }))

startService(probe, 3003)