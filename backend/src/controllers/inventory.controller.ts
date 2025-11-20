import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { InventoryItem } from '../entities/InventoryItem';
import { AuthRequest } from '../middleware/auth';
import { logAction } from '../services/audit.service';

export async function createItem(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(InventoryItem);
  const item = repo.create(req.body as Partial<InventoryItem>);
  await repo.save(item);
  await logAction({ userId: req.user?.id, action: 'CREAR_PRODUCTO', entityId: item.id, entityType: 'InventoryItem' });
  res.status(201).json(item);
}

export async function updateItem(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(InventoryItem);
  const { id } = req.params as { id: string };
  const item = await repo.findOne({ where: { id } });
  if (!item) {
    res.status(404).json({ message: 'Producto no encontrado' });
    return;
  }
  repo.merge(item, req.body as Partial<InventoryItem>);
  await repo.save(item);
  await logAction({ userId: req.user?.id, action: 'ACTUALIZAR_PRODUCTO', entityId: item.id, entityType: 'InventoryItem' });
  res.json(item);
}

export async function listInventory(_req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(InventoryItem);
  const items = await repo.find({ order: { name: 'ASC' } });
  res.json(items);
}
