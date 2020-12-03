const fastify = require('fastify')
const fetch = require('node-fetch')
const hyperid = require('hyperid')

const service = fastify({ logger: true, genReqId: hyperid() });

service.get('/', async (request, reply) => {
    const pc = await fetch('http://servicec:3000')

    service.log.info(`Upstream call to Service C returned '${pc.status}'`);

    if (pc.ok) {
        reply
            .header('X-API-Version', process.env.SERVICE_VERSION)
            .send({ version: process.env.SERVICE_VERSION });
    } else {
        reply.code(500).send({ error: `Upstream call to Service C failed` });
    }
})

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

probe.get('/health', async (request, reply) => ({ status: 'Service B is healthy' }))

startService(probe, 3003)