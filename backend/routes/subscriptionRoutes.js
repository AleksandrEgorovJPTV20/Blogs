const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/subscription',verifyJWT, subscriptionController.updateUserSubscription);

module.exports = router;