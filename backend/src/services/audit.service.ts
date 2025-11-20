import { AppDataSource } from '../config/data-source';
import { AuditLog } from '../entities/AuditLog';

export async function logAction(params: {
  userId?: string;
  action: string;
  entityId?: string;
  entityType?: string;
  details?: string;
}): Promise<void> {
  const repository = AppDataSource.getRepository(AuditLog);
  await repository.save({
    user: params.userId ? ({ id: params.userId } as any) : undefined,
    action: params.action,
    entityId: params.entityId,
    entityType: params.entityType,
    details: params.details,
  });
}
