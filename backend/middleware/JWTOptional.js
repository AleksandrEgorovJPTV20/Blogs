require('dotenv').config();
const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');

const JWTOptional = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader || !authHeader?.startsWith('Token ') || !authHeader.split(' ')[1].length) {
        req.loggedin = false;
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.SECRET_KEY,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.loggedin = true;
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            const user = await User.findById(req.userId).exec();
            const currentDate = new Date();

            // Проверка срока действия подписки и обновление, если необходимо
            const userSubscription = await UserSubscription.findOne({ _id: user.subscriptionId }).exec();
            if (userSubscription && userSubscription.expirationDate <= currentDate) {
                const freeSubscription = await Subscription.findOne({ type: 'free' }).exec();
                if (freeSubscription && freeSubscription._id.toString() !== userSubscription.subscriptionId.toString()) {
                    console.log('Subscription has expired');
                    console.log('Creating a new subscription');
                    // Создание новой записи UserSubscription с бесплатной подпиской
                    const newSubscription = new UserSubscription({
                        userId: req.userId,
                        subscriptionId: freeSubscription._id,
                        startDate: new Date(),
                        expirationDate: new Date(),
                        articlesLeft: 5
                    });
                    await newSubscription.save();

                    // Обновление пользователя с новым subscriptionId
                    user.subscriptionId = newSubscription._id;
                    await user.save();
                    return res.status(402).json({ message: 'Subscription has been expired' });
                }
            }
            next();
        }
    )
};

module.exports = JWTOptional;