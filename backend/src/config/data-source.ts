import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import { VehicleWash } from '../entities/VehicleWash';
import { InventoryItem } from '../entities/InventoryItem';
import { AuditLog } from '../entities/AuditLog';

const DB_TYPE = (process.env.DB_TYPE || 'sqlite') as DataSourceOptions['type'];

const common = {
  entities: [User, VehicleWash, InventoryItem, AuditLog],
  synchronize: true,
};

function buildOptions(): DataSourceOptions {
  if (DB_TYPE === 'mssql') {
    return {
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || 'sa',
      password: process.env.DB_PASSWORD || 'Password123',
      database: process.env.DB_NAME || 'biker_wash',
      options: { encrypt: false },
      ...common,
    } as DataSourceOptions;
  }

  if (DB_TYPE === 'oracle') {
    return {
      type: 'oracle',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 1521,
      username: process.env.DB_USERNAME || 'system',
      password: process.env.DB_PASSWORD || 'oracle',
      sid: process.env.DB_SID || 'FREE',
      schema: process.env.DB_SCHEMA || 'BikerWash',
      ...common,
    } as DataSourceOptions;
  }

  return {
    type: 'sqlite',
    database: process.env.DB_PATH || 'biker_wash.sqlite',
    ...common,
  } as DataSourceOptions;
}

export const AppDataSource = new DataSource(buildOptions());
