const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    required: true,
  }, 
},
{
    versionKey: false,
}
);

userSubscriptionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
