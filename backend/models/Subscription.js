const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const subscriptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    }
},
    {
        timestamps: false,
        versionKey: false,
    }
);


subscriptionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Subscription', subscriptionSchema);