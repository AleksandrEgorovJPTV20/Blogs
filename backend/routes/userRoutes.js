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
*  schemas:
*      UserUpdate:
*          type: object
*          required:
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
*                   bio:
*                       type: string
*                       description: password user
*                       example: maksik1303
*                   image:
*                       type: string
*                       description: password user
*                       example: maksik1303
*/

/**
* @swagger
* components:
*   securitySchemes:
*     JWTAuth:
*       type: apiKey
*       name: Authorization
*       in: header
*       default: "Token "
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
 *         description: sign in data.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to sign in.
 */

/**
 * @swagger
 * 
 * /api/user:
 *   get:
 *     summary: get User 
 *     tags: [Users]
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       201:
 *         description: User.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get user.
 */

/**
 * @swagger
 * 
 * /api/user:
 *   put:
 *     summary: update User 
 *     tags: [Users]
*     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       201:
 *         description: The updated User.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to update user.
 */

