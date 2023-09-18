const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');
const JWTOptional = require('../middleware/JWTOptional');

//Прочитать профиль
router.get('/:username',JWTOptional, profileController.getProfile);

//Следить за новостями пользователя
router.post('/:username/follow', verifyJWT, profileController.followUser);

router.delete('/:username/follow', verifyJWT, profileController.unFollowUser);
module.exports = router;