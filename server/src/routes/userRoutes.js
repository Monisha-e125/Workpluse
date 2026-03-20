const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  activateUser,
  updateSkills,
  searchUsers,
  getUserStats
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes require authentication
router.use(protect);

// ═══ Routes available to ALL authenticated users ═══
router.get('/search', searchUsers);
router.get('/', getAllUsers);           // ← REMOVED minRole('manager')
router.get('/stats', getUserStats);     // ← REMOVED authorize('admin')
router.put('/skills', updateSkills);
router.get('/:id', getUserById);

// ═══ Admin-only routes ═══
router.put('/:id/role', authorize('admin'), updateUserRole);
router.put('/:id/deactivate', authorize('admin'), deactivateUser);
router.put('/:id/activate', authorize('admin'), activateUser);

module.exports = router;