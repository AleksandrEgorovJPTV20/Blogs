const Article = require('../models/Article');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const UserSubscription = require('../models/UserSubscription');
//Slugify - это процесс преобразования строки текста, такой как заголовок статьи или имя файла, 
//в строку, которая может быть использована в URL в качестве "слага" (части URL, представляющей читабельное описание содержания страницы).

//Создание статьи
const createArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const author = await User.findById(id).exec();

    const { title, description, body, tagList } = req.body.article;

    if (!title || !description || !body) {
        res.status(400).json({message: "All fields are required"});
    }

    const article = await Article.create({ title, description, body });

    article.author = id;

    if (Array.isArray(tagList) && tagList.length > 0) {
        article.tagList = tagList;
    }

    await article.save()

    return await res.status(200).json({
        article: await article.toArticleResponse(author)
    })

});

//Удаление статьи
const deleteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const { slug } = req.params;

    const loginUser = await User.findById(id).exec();

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const article = await Article.findOne({slug}).exec();

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    if (article.author.toString() === loginUser._id.toString()) {
        await Article.deleteOne({slug: slug});
        res.status(200).json({
            message: "Article successfully deleted!!!"
        })
    } else {
        res.status(403).json({
            message: "Only the author can delete his article"
        })
    }

});

//Любимая статья
const favoriteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const { slug } = req.params;

    const loginUser = await User.findById(id).exec();

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const article = await Article.findOne({slug}).exec();

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    await loginUser.favorite(article._id);

    const updatedArticle = await article.updateFavoriteCount();

    return res.status(200).json({
        article: await updatedArticle.toArticleResponse(loginUser)
    });
});


const unfavoriteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const { slug } = req.params;

    const loginUser = await User.findById(id).exec();

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const article = await Article.findOne({slug}).exec();

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    await loginUser.unfavorite(article._id);

    await article.updateFavoriteCount();

    return res.status(200).json({
        article: await article.toArticleResponse(loginUser)
    });
});

//чтение статей с символами
const getArticleWithSlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const article = await Article.findOne({ slug }).exec();

    const userId = req.userId;

    const loginUser = await User.findById(userId).exec();

    const userSubscription = await UserSubscription.findById(loginUser.subscriptionId).exec();

    if (userSubscription.expirationDate < userSubscription.startDate) {
        return res.status(401).json({
            message: "Subscription has expired"
        });
    }

    if (userSubscription.articlesLeft <= 0) {
        return res.status(401).json({
            message: "Articles are not available"
        });
    }

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    // Уменьшаем значение articlesLeft на 1 и сохраняем обновленную историю подписки
    userSubscription.articlesLeft -= 1;
    await userSubscription.save();

    return res.status(200).json({
        article: await article.toArticleResponse(false)
    });
});


//обновление статей
const updateArticle = asyncHandler(async (req, res) => {
    const  userId  = req.userId;

    const { article } = req.body;

    const { slug } = req.params;

    const loginUser = await User.findById(userId).exec();

    const target = await Article.findOne({ slug }).exec();

    if (article.title) {
        target.title = article.title;
    }
    if (article.description) {
        target.description = article.description;
    }
    if (article.body) {
        target.body = article.body;
    }
    if (article.tagList) {
        target.tagList = article.tagList;
    }

    await target.save();
    return res.status(200).json({
        article: await target.toArticleResponse(loginUser)
    })
});

//Чтение статей создаными пользователями за которыми следишь
const feedArticles = asyncHandler(async (req, res) => {
    let limit = 20;
    let offset = 0;

    if (req.query.limit) {
        limit = req.query.limit;
    }

    if (req.query.offset) {
        offset = req.query.offset;
    }

    const userId = req.userId;

    const loginUser = await User.findById(userId).exec();

    const filteredArticles = await Article.find({author: {$in: loginUser.followingUsers}})
        .limit(Number(limit))
        .skip(Number(offset))
        .exec();

    const articleCount = await Article.count({author: {$in: loginUser.followingUsers}});

    return res.status(200).json({
        articles: await Promise.all(filteredArticles.map(async article => {
            return await article.toArticleResponse(loginUser);
        })),
        articlesCount: articleCount
    });
});

const listArticles = asyncHandler(async (req, res) => {
    let limit = 20;
    let offset = 0;
    let query = {};
    if (req.query.limit) {
        limit = req.query.limit;
    }

    if (req.query.offset) {
        offset = req.query.offset;
    }
    if (req.query.tag) {
        query.tagList = { $in: [req.query.tag] };
    }

    if (req.query.author) {
        const author = await User.findOne({ username: req.query.author }).exec();
        if (author) {
            query.author = author._id;
        }
    }

    if (req.query.favorited) {
        const favoriter = await User.findOne({ username: req.query.favorited }).exec();
        if (favoriter) {
            query._id = { $in: favoriter.favouriteArticles };
        }
    }

    if (req.loggedin) {
        const loginUser = await User.findById(req.userId).exec();
        const userSubscription = await UserSubscription.findById(loginUser.subscriptionId).exec();
        
        // Check if there are available articles
        if (userSubscription.articlesLeft <= 0) {
            return res.status(401).json({
                message: "Articles are not available"
            });
        }

        // Decrease the articlesLeft count by 1
        userSubscription.articlesLeft -= 1;
        await userSubscription.save();
    }

    const filteredArticles = await Article.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({ createdAt: 'desc' }).exec();

    const articleCount = await Article.count(query);

    const loginUser = req.loggedin ? await User.findById(req.userId).exec() : null;
    const responseFunc = req.loggedin ? article => article.toArticleResponse(loginUser) : article => article.toArticleResponseNotBought(false);

    return res.status(200).json({
        articles: await Promise.all(filteredArticles.map(responseFunc)),
        articlesCount: articleCount
    });
});

module.exports = {
    createArticle,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle,
    getArticleWithSlug,
    updateArticle,
    feedArticles,
    listArticles
}