const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');

//Авторизация
router.post('/users/login', userController.userLogin);

//Регистрация
router.post('/users', userController.registerUser);

//Чтение авторизованного пользователя
router.get('/user',verifyJWT, userController.getCurrentUser);

//Обновление пользователя
router.put('/user',verifyJWT, userController.updateUser);

module.exports = router;