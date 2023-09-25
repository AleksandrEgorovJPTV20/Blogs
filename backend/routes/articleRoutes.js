const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const JWTOptional = require('../middleware/JWTOptional');
const articleController = require('../controllers/articlesController');

router.get('/feed', verifyJWT, articleController.feedArticles);

//Список статей
router.get('/', JWTOptional, articleController.listArticles);

//чтение статить со символами
router.get('/:slug',verifyJWT, articleController.getArticleWithSlug);

//Создание статьи
router.post('/', verifyJWT, articleController.createArticle);

//Удаление статьи
router.delete('/:slug', verifyJWT, articleController.deleteArticle);

//Избранные статьи
router.post('/:slug/favorite', verifyJWT, articleController.favoriteArticle);

router.delete('/:slug/favorite', verifyJWT, articleController.unfavoriteArticle);

//Обновление
router.put('/:slug', verifyJWT, articleController.updateArticle);


module.exports = router;