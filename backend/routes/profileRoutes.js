const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');
const JWTOptional = require('../middleware/JWTOptional');

//Прочитать профиль
router.get('/:username',JWTOptional, profileController.getProfile);

//Следить за новостями пользователя
router.post('/:username/follow', verifyJWT, profileController.followUser);

router.delete('/:username/unFollow', verifyJWT, profileController.unFollowUser);
module.exports = router;


/**
* @swagger
* 
* tags:
*   name: Profiles
*   description: The Tag managing API
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
 * /api/profiles/{username}:
 *   get:
 *     summary: get Profile 
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *             type: string
 *         required: true
 *         description: string username of user to find profile
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       201:
 *         description: User.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get user profile.
 */


/**
 * @swagger
 * 
 * /api/profiles/{username}/follow:
 *   post:
 *     summary: follow Profile 
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *             type: string
 *         required: true
 *         description: string username of user to follow profile
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       201:
 *         description: User.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get user profile.
 */

/**
 * @swagger
 * 
 * /api/profiles/{username}/unFollow:
 *   delete:
 *     summary: unFollow Profile 
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *             type: string
 *         required: true
 *         description: string username of user to unFollow profile
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       201:
 *         description: unFollow user successfully.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to unFollow user profile.
 */