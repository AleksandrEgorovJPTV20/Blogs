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
    articlesLeft: {
        type: Number,
        required: true,
        default: 5
    }
},
    {
        timestamps: false,
        versionKey: false,
    }
);


subscriptionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Subscription', subscriptionSchema);