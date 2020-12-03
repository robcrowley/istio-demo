const fastify = require('fastify')
const hyperid = require('hyperid')

const service = fastify({ logger: true, genReqId: hyperid() });

service.get('/', (request, reply) => {
    reply
        .header('X-API-Version', process.env.SERVICE_VERSION)
        .send({
            version: process.env.SERVICE_VERSION
        });
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

probe.get('/health', (request, reply) => ({ status: 'Service D is healthy' }))

startService(probe, 3003)