const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/subscription', subscriptionController.readAllSubscriptions);
router.post('/subscription',verifyJWT, subscriptionController.updateUserSubscription);

module.exports = router;

/**
 * @swagger
 * 
 * tags:
 *   name: Subscriptions
 *   description: The Subscription managing API
 * /api/subscription:
 *   get:
 *     summary: get subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       201:
 *         description: The created Subscriptions.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get Subscriptions.
 */