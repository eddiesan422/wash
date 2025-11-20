import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { VehicleWash, WashStatus } from '../entities/VehicleWash';
import { User, UserRole } from '../entities/User';
import { AuthRequest } from '../middleware/auth';
import { logAction } from '../services/audit.service';

export async function createWash(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const userRepo = AppDataSource.getRepository(User);
  const {
    vehicleType,
    plate,
    checkInAt,
    customerName,
    customerDocument,
    customerPhone,
    washType,
    assignedEmployeeId,
    amount,
  } = req.body;

  const employeeId = req.user?.role === UserRole.EMPLOYEE ? req.user.id : assignedEmployeeId || req.user?.id;
  const employee = await userRepo.findOne({ where: { id: employeeId } });
  if (!employee) {
    res.status(400).json({ message: 'Empleado no encontrado' });
    return;
  }

  const wash = repo.create({
    vehicleType,
    plate,
    checkInAt: checkInAt ? new Date(checkInAt) : new Date(),
    customerName,
    customerDocument,
    customerPhone,
    washType,
    status: WashStatus.WAITING,
    assignedEmployee: employee,
    amount,
  });

  await repo.save(wash);
  await logAction({
    userId: req.user?.id,
    action: 'CREAR_LAVADO',
    entityId: wash.id,
    entityType: 'VehicleWash',
    details: JSON.stringify({ plate, washType }),
  });
  res.status(201).json(wash);
}

export async function listAssigned(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const where = req.user?.role === UserRole.EMPLOYEE ? { assignedEmployee: { id: req.user.id } } : {};
  const washes = await repo.find({ where, order: { checkInAt: 'DESC' } });
  res.json(washes);
}

export async function updateStatus(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const { id } = req.params as { id: string };
  const wash = await repo.findOne({ where: { id } });
  if (!wash) {
    res.status(404).json({ message: 'Lavado no encontrado' });
    return;
  }

  if (req.user?.role === UserRole.EMPLOYEE && wash.assignedEmployee.id !== req.user.id) {
    res.status(403).json({ message: 'Solo puedes actualizar tus lavados asignados' });
    return;
  }

  const { status } = req.body as { status: WashStatus };
  wash.status = status;
  await repo.save(wash);
  await logAction({ userId: req.user?.id, action: 'ACTUALIZAR_ESTADO', entityId: wash.id, entityType: 'VehicleWash', details: status });
  res.json(wash);
}

export async function markPaid(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const { paymentMethod } = req.body as { paymentMethod: string };
  const { id } = req.params as { id: string };
  const wash = await repo.findOne({ where: { id } });
  if (!wash) {
    res.status(404).json({ message: 'Lavado no encontrado' });
    return;
  }

  wash.status = WashStatus.PAID;
  wash.paymentMethod = paymentMethod;
  wash.paidAt = new Date();
  await repo.save(wash);
  await logAction({ userId: req.user?.id, action: 'MARCAR_PAGADO', entityId: wash.id, entityType: 'VehicleWash', details: paymentMethod });
  res.json(wash);
}

export async function reassignWash(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const userRepo = AppDataSource.getRepository(User);
  const { id } = req.params as { id: string };
  const wash = await repo.findOne({ where: { id } });
  if (!wash) {
    res.status(404).json({ message: 'Lavado no encontrado' });
    return;
  }

  if (wash.status !== WashStatus.WAITING) {
    res.status(400).json({ message: 'Solo se pueden reasignar lavados en espera' });
    return;
  }

  const { employeeId } = req.body as { employeeId: string };
  const employee = await userRepo.findOne({ where: { id: employeeId } });
  if (!employee) {
    res.status(400).json({ message: 'Empleado no encontrado' });
    return;
  }

  wash.assignedEmployee = employee;
  await repo.save(wash);
  await logAction({ userId: req.user?.id, action: 'REASIGNAR_LAVADO', entityId: wash.id, entityType: 'VehicleWash', details: employeeId });
  res.json(wash);
}

export async function deleteWaiting(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const { id } = req.params as { id: string };
  const wash = await repo.findOne({ where: { id } });
  if (!wash) {
    res.status(404).json({ message: 'Lavado no encontrado' });
    return;
  }

  if (wash.status !== WashStatus.WAITING) {
    res.status(400).json({ message: 'Solo se pueden eliminar lavados en espera' });
    return;
  }

  await repo.delete(wash.id);
  await logAction({ userId: req.user?.id, action: 'ELIMINAR_LAVADO', entityId: wash.id, entityType: 'VehicleWash' });
  res.status(204).send();
}

export async function history(req: AuthRequest, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(VehicleWash);
  const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
  const qb = repo.createQueryBuilder('wash').orderBy('wash.checkInAt', 'DESC');

  if (startDate) {
    qb.andWhere('wash.checkInAt >= :startDate', { startDate });
  }
  if (endDate) {
    qb.andWhere('wash.checkInAt <= :endDate', { endDate });
  }

  const washes = await qb.getMany();
  res.json(washes);
}

export async function exportExcelPlaceholder(_req: AuthRequest, res: Response): Promise<void> {
  res.json({
    message:
      'La exportación a Excel se implementará en el despliegue final. Filtrar por fecha está soportado en /api/washes/history.',
  });
}
