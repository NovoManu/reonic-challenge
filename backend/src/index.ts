import app from './server'

const start = async () => {
  const fastify = await app()
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
