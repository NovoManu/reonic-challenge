import { PrismaClient } from '@prisma/client';
import { DB_CONFIG } from './config';
import { logger } from './logger';

class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient;
  private isConnected: boolean = false;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    if (process.env.NODE_ENV === 'development') {
      this.prisma.$use(async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const duration = Date.now() - before;
        
        logger.debug('Prisma Query', {
          model: params.model,
          action: params.action,
          duration: `${duration}ms`,
        });
        
        return result;
      });
    }
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.prisma.$connect();
        this.isConnected = true;
        logger.info('Database connection established');
      } catch (error) {
        logger.error('Failed to connect to database', error instanceof Error ? error : new Error('Unknown error'));
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.prisma.$disconnect();
        this.isConnected = false;
        logger.info('Database connection closed');
      } catch (error) {
        logger.error('Error disconnecting from database', error instanceof Error ? error : new Error('Unknown error'));
      }
    }
  }
}

export const db = DatabaseManager.getInstance();
export const prisma = db.getClient();

export const setupGracefulShutdown = (): void => {
  const shutdown = async () => {
    logger.info('Shutting down database connections...');
    await db.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};
