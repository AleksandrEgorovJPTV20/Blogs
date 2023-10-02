const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/subscriptions', subscriptionController.readAllSubscriptions);
router.post('/subscription',verifyJWT, subscriptionController.updateUserSubscription);

module.exports = router;


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWTAuth:
 *       type: apiKey
 *       name: Authorization
 *       in: header
 *       default: "Token "
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - selectedPlan
 *       properties:
 *         selectedPlan:
 *           type: string
 *           description: User's subscription plan
 *           example: free
 * 
 * 
 * tags:
 *   - name: Subscriptions
 *     description: The Subscription managing API
 * 
 * /api/subscriptions:
 *   get:
 *     summary: Get subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: The list of Subscriptions.
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to get Subscriptions.
 * 
 * /api/subscription:
 *   post:
 *     summary: Update user's subscription
 *     description: Update the user's current subscription with a new one.
 *     tags: [Subscriptions]
 *     security:
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       201:
 *         description: Subscription updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Invalid request data.
 *       422:
 *         description: Failed to update subscription.
 */
