const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const authUtils = require('../../middlewares/authUtil');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/', authUtils.checkToken, userController.readAllUsers);
router.put('/:id', authUtils.checkToken, userController.updateUser);
router.delete('/:id', authUtils.checkToken, userController.deleteUser);
router.get('/:id', authUtils.checkToken, userController.readUserInfo);

module.exports = router;