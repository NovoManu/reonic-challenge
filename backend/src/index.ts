import app from './server'
import { SERVER_CONFIG } from './utils/config'
import { setupGracefulShutdown } from './utils/database'
import { logger } from './utils/logger'

const start = async () => {
  const fastify = await app()
  try {
    await fastify.listen({ 
      port: SERVER_CONFIG.PORT, 
      host: SERVER_CONFIG.HOST 
    })
    fastify.log.info(`Server listening on ${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection', err instanceof Error ? err : new Error(String(err)))
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err instanceof Error ? err : new Error(String(err)))
  process.exit(1)
})

// Setup graceful shutdown for database connections
setupGracefulShutdown()

start()
