import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { hashPassword } from '../utils/password';

export async function ensureAdminUser(): Promise<void> {
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOne({ where: { username: 'admin' } });
  if (existing) return;

  const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
  const user = repo.create({
    username: 'admin',
    fullName: 'Administrador',
    passwordHash,
    role: UserRole.ADMIN,
  });
  await repo.save(user);
}

export async function createUser(data: {
  username: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  password: string;
  active?: boolean;
}): Promise<User> {
  const repo = AppDataSource.getRepository(User);
  const passwordHash = await hashPassword(data.password);
  const user = repo.create({ ...data, passwordHash });
  return repo.save(user);
}
