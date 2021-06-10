const Joi = require('joi');
const { objectId } = require('./custom.validation');

const uploadAudioFile = {
    params: Joi.object().keys({
        foodId:  Joi.string().custom(objectId),
    }),
};

const createFood = {
    params: Joi.object().keys({
        foodId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
    }),
};

const getFoods = {
    query: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string(),
        category: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        skip: Joi.number().integer(),
      }) 
};

const getFood = {
    params: Joi.object().keys({
        foodId: Joi.string().custom(objectId),
    }),
};

const updateFood = {
    params: Joi.object().keys({
        foodId: Joi.string().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            description:Joi.string(),
            category:Joi.string(),
            tellers: Joi.string(),
        }),
};

const deleteFood = {
    params: Joi.object().keys({
        foodId: Joi.string().custom(objectId),
    }),
};



module.exports = {
    uploadAudioFile,
    createFood,
    getFood,
    getFoods,
    updateFood,
    deleteFood,
};

