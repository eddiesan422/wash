import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import {
  createWash,
  deleteWaiting,
  exportExcelPlaceholder,
  history,
  listAssigned,
  markPaid,
  reassignWash,
  updateStatus,
} from '../controllers/wash.controller';
import { createItem, listInventory, updateItem } from '../controllers/inventory.controller';
import { createOrUpdateUser, listUsers, changePassword } from '../controllers/user.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { UserRole } from '../entities/User';
import { listLogs } from '../controllers/log.controller';

const router = Router();

router.post('/auth/login', login);

router.use(authenticate);

router.get('/washes', listAssigned);
router.post('/washes', requireRoles([UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.MANAGER]), createWash);
router.patch('/washes/:id/status', requireRoles([UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.MANAGER]), updateStatus);
router.patch('/washes/:id/paid', requireRoles([UserRole.SUPERVISOR, UserRole.MANAGER]), markPaid);
router.patch('/washes/:id/reassign', requireRoles([UserRole.SUPERVISOR, UserRole.MANAGER]), reassignWash);
router.delete('/washes/:id', requireRoles([UserRole.SUPERVISOR, UserRole.MANAGER]), deleteWaiting);
router.get('/washes/history', requireRoles([UserRole.MANAGER]), history);
router.get('/washes/export', requireRoles([UserRole.MANAGER]), exportExcelPlaceholder);

router.get('/inventory', requireRoles([UserRole.MANAGER]), listInventory);
router.post('/inventory', requireRoles([UserRole.MANAGER]), createItem);
router.patch('/inventory/:id', requireRoles([UserRole.MANAGER]), updateItem);

router.get('/users', requireRoles([UserRole.ADMIN]), listUsers);
router.post('/users', requireRoles([UserRole.ADMIN]), createOrUpdateUser);
router.patch('/users/:id', requireRoles([UserRole.ADMIN]), createOrUpdateUser);
router.post('/users/change-password', changePassword);

router.get('/logs', requireRoles([UserRole.ADMIN]), listLogs);

export default router;
