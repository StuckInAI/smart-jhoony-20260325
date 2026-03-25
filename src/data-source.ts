import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { CalculationHistory } from './entities/History'

const databasePath = process.env.DATABASE_PATH || './database/calculator.db'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [CalculationHistory],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
})

// Initialize connection
AppDataSource.initialize().catch((error) => {
  console.error('Database initialization error:', error)
})
