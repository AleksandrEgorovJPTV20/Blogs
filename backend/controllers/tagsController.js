const Article = require('../models/Article');
const asyncHandler = require('express-async-handler');

//Чтение тэгов
const getTags = asyncHandler( async (req, res) => {
    const tags = await Article.find().distinct('tagList').exec();
    res.status(200).json({
        tags: tags
    });
});

module.exports = {
    getTags
}