const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const JWTOptional = require('../middleware/JWTOptional');
const commentController = require('../controllers/commentsController');

//Создание комментария
router.post('/:slug/comments', verifyJWT, commentController.addCommentsToArticle);

//Чтение комментария
router.get('/:slug/comments', JWTOptional, commentController.getCommentsFromArticle);

//
router.delete('/:slug/comments/:id', verifyJWT, commentController.deleteComment)

module.exports = router;