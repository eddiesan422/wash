import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { AuditLog } from '../entities/AuditLog';
import { AuthRequest } from '../middleware/auth';

export async function listLogs(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(AuditLog);
  const logs = await repo.find({ order: { createdAt: 'DESC' }, take: 200 });
  res.json(logs);
}
