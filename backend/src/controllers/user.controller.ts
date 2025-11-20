import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { AuthRequest } from '../middleware/auth';
import { comparePassword, hashPassword } from '../utils/password';
import { logAction } from '../services/audit.service';

export async function listUsers(_req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(User);
  const users = await repo.find();
  res.json(users);
}

export async function createOrUpdateUser(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(User);
  const { id, username, fullName, role, phoneNumber, password, active = true } = req.body as {
    id?: string;
    username: string;
    fullName: string;
    role: UserRole;
    phoneNumber?: string;
    password?: string;
    active?: boolean;
  };

  let user = id ? await repo.findOne({ where: { id } }) : repo.create();
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  user.username = username;
  user.fullName = fullName;
  user.role = role;
  user.phoneNumber = phoneNumber;
  user.active = active;
  if (password) {
    user.passwordHash = await hashPassword(password);
  }

  const saved = await repo.save(user);
  await logAction({ userId: req.user?.id, action: 'ADMIN_USUARIO', entityId: saved.id, entityType: 'User', details: role });
  res.status(id ? 200 : 201).json(saved);
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(User);
  const { currentPassword, newPassword } = req.body;
  const { id } = req.user as { id: string };
  const user = await repo.findOne({ where: { id } });
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ message: 'Contraseña actual incorrecta' });
    return;
  }
  user.passwordHash = await hashPassword(newPassword);
  await repo.save(user);
  await logAction({ userId: req.user?.id, action: 'CAMBIAR_CONTRASEÑA', entityId: user.id, entityType: 'User' });
  res.json({ message: 'Contraseña actualizada' });
}
