const express = require('express');
const { createUser, getUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

router.post('/', createUser);
router.get('/:id', getUser,authenticateToken);
router.get('/', getUsers,authenticateToken);
router.put('/:id', updateUser,authenticateToken);
router.delete('/:id', deleteUser,authenticateToken);

module.exports = router;
