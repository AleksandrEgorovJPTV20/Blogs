const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');


//Регистрация
//POST /api/users
//Объязательные поля {email, username, password}
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    //Хеширование пароля
    const hashedPwd = await bcrypt.hash(user.password, 10);

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) { //Пользователь создан
        res.status(201).json({
            user: createdUser.toUserResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user"
            }
        });
    }
});

//Прочитать свой профиль
//GET /api/user
const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({message: "User Not Found"});
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
        return res.status(400).json({message: "All fields are required"});
    }

    const loginUser = await User.findOne({ email: user.email }).exec();


    if (!loginUser) {
        return res.status(404).json({message: "User Not Found"});
    }

    const match = await bcrypt.compare(user.password, loginUser.password);

    if (!match) return res.status(401).json({ message: 'Unauthorized: Wrong password' })

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
        return res.status(400).json({message: "Required a User object"});
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
    updateUser
}