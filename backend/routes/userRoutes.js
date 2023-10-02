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

/**
* @swagger
* components:
*  schemas:
*      User:
*          type: object
*          required:
*              - username
*              - email
*              - password
*          properties:
*              user:
*                  type: object
*                  properties:
*                   username:
*                       type: string
*                       description: username of User
*                       example: max
*                   email:
*                       type: string
*                       description: user email
*                       example: max@test.ee
*                   password:
*                       type: string
*                       description: password user
*                       example: maksik1303
*/

/**
* @swagger
* components:
*  schemas:
*      UserLogin:
*          type: object
*          required:
*              - email
*              - password
*          properties:
*              user:
*                  type: object
*                  properties:
*                   email:
*                       type: string
*                       description: user email
*                       example: max@test.ee
*                   password:
*                       type: string
*                       description: password user
*                       example: maksik1303
*/

/**
* @swagger
* components:
*   parameters:
*     authorization:
*       name: "Token "
*       in: header
*       description: Access Token
*       required: true
*       schema:
*         type: string
*/

/**
 * @swagger
 * 
 * tags:
 *   name: Users
 *   description: The User managing API
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, username, and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created User.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to register user.
 */

/**
 * @swagger
 * 
 * /api/users/login:
 *   post:
 *     summary: Sign in 
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       201:
 *         description: The created User.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to register user.
 */

