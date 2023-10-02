const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');

router.get('/', tagsController.getTags)

module.exports = router;

/**
 * @swagger
 * 
 * tags:
 *   name: Tags
 *   description: The Tag managing API
 * /api/tags:
 *   get:
 *     summary: get Tags
 *     tags: [Tags]
 *     responses:
 *       201:
 *         description: The created Tags.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get Tags.
 */