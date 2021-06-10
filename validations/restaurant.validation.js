const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRestaurant = {
    body: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string(),
        category: Joi.string(),
        description: Joi.string(),
  }),
};

const uploadPoster = {
    params: Joi.object().keys({
        restauranId: Joi.string().custom(objectId),
    }),
};  

const getRestaurant = {
    query: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string(),
        category: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
      })  
};

const getRestaurant = {
    query: Joi.object().keys({
        restauranId: Joi.string().custom(objectId),
    }),
};

const updateRestaurant = {
    query: Joi.object().keys({
        restauranId: Joi.string().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            slug: Joi.string(),
            category: Joi.string(),
            description: Joi.string(),
        }),
};

const deleteRestaurant = {
    query: Joi.object().keys({
      restauranId: Joi.string().custom(objectId),
    }),
  };

const searchRestaurant = {
    params: Joi.object().keys({
        channelTitle: Joi.string(),
    }),
};
module.exports = {
    createRestaurant,
    uploadPoster,
    getRestaurant,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurant
};