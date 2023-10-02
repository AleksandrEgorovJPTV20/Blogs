const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const JWTOptional = require('../middleware/JWTOptional');
const commentController = require('../controllers/commentsController');

//Создание комментария
router.post('/:slug/comment', verifyJWT, commentController.addCommentsToArticle);

//Чтение комментария
router.get('/:slug/comments', JWTOptional, commentController.getCommentsFromArticle);

//
router.delete('/:slug/comment/:id', verifyJWT, commentController.deleteComment)

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWTAuth:
 *       type: apiKey
 *       name: Authorization
 *       in: header
 *   schemas:
 *     Comments:
 *       type: object
 *       properties:
 *         comment:
 *           type: object
 *           properties:
 *             body:
 *               type: string
 *               description: The content of the comment.
 *
 * tags:
 *   - name: Comments
 *     description: The Comments managing API
 * 
 * /api/articles/{slug}/comments:
 *   get:
 *     summary: Get comments from an article
 *     tags: [Comments]
 *     parameters:
 *      - name: slug
 *        in: path
 *        required: true
 *        description: Input article slug
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: All comments from an article.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   commentId:
 *                     type: integer
 *                     description: Unique identifier for the comment.
 *                   content:
 *                     type: string
 *                     description: Comment content.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get comments.
 * 
 * /api/articles/{slug}/comment:
 *   post:
 *     summary: Add a comment
 *     description: Authorized user adds a comment to an article
 *     tags: [Comments]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *      - name: slug
 *        in: path
 *        required: true
 *        description: Input article slug
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comments'
 *     responses:
 *       201:
 *         description: Comment added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comments'
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to add a comment.
 * 
 * /api/articles/{slug}/comment/{id}:
 *   delete:
 *     summary: Delete a Comment
 *     description: Delete a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *      - name: slug
 *        in: path
 *        required: true
 *        description: Input article slug
 *        schema:
 *          type: string
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID of the comment to delete.
 *        schema:
 *          type: string
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       204:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission to delete the comment.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal server error - Something went wrong on the server.
 */
