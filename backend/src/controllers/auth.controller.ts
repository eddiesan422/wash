import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { comparePassword } from '../utils/password';
import { generateToken } from '../middleware/auth';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  const repo = AppDataSource.getRepository(User);

  const user = await repo.findOne({ where: { username } });
  if (!user) {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    return;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    return;
  }

  const token = generateToken({ id: user.id, role: user.role, username: user.username });
  res.json({ token, role: user.role, fullName: user.fullName });
}
