const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const verifyJWT = require('../middleware/verifyJWT');

//Регистрация
//POST /api/users
//Объязательные поля {email, username, password}
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({message: "Email, username, password should be not empty."});
    }

    //Хеширование пароля
    const hashedPwd = await bcrypt.hash(user.password, 10);

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) {
        // Создаем подписку типа "free" по умолчанию
        const freeSubscription = await Subscription.findOne({ type: "free" });

        if (!freeSubscription) {
            return res.status(500).json({ message: "Default subscription not found." });
        }

        // Создаем историю подписки для нового пользователя
        const userSubscription = new UserSubscription({
            userId: createdUser._id,
            subscriptionId: freeSubscription._id,
            startDate: new Date(),
            expirationDate: new Date(),
            articlesLeft: 5,
        });

        // Устанавливаем идентификатор подписки пользователя
        createdUser.subscriptionId = userSubscription._id;

        // Сохраняем новую историю подписки и обновляем пользователя
        await Promise.all([userSubscription.save(), createdUser.save()]);

        res.status(201).json({
            user: createdUser.toUserResponse()
        });
    } else {
        res.status(422).json({
            errors: {
                body: "Failed to register."
            }
        });
    }
});

//Прочитать свой профиль
//GET /api/user
const getCurrentUser = asyncHandler(async (req, res) => {
    verifyJWT;
    const email = req.userEmail;
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({message: "User not found."});
    }

    res.status(200).json({
        user: user.toUserResponse()
    })

});

//вход пользователя
//POST /api/users/login
//Объязательные поля {email, password}
const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user || !user.email || !user.password) {
        return res.status(400).json({message: "Email, password should be not empty."});
    }

    const loginUser = await User.findOne({ email: user.email }).exec();


    if (!loginUser) {
        return res.status(404).json({message: "User not found."});
    }

    const match = await bcrypt.compare(user.password, loginUser.password);

    if (!match) return res.status(401).json({ message: 'Wrong password.' })

    res.status(200).json({
        user: loginUser.toUserResponse()
    });

});

//обновить профиль
//если пароль или почта изменена, то токен меняется тоже
//PUT /api/user
const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({message: "User object is required"});
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPwd = await bcrypt.hash(user.password, 10);
        target.password = hashedPwd;
    }
    if (typeof user.image !== 'undefined') {
        target.image = user.image;
    }
    if (typeof user.bio !== 'undefined') {
        target.bio = user.bio;
    }
    if (typeof user.money !== 'undefined') {
        target.money = user.money;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });

});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
}