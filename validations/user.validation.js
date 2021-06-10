const Joi = require('joi');
const { objectId } = require('./custom.validation');


const setAvatar = {
    query: Joi.object().keys({
        userId:  Joi.string().custom(objectId),
    }),
};

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        sex: Joi.string(),
        bio: Joi.string(),
        userName: Joi.string(),
        role: Joi.string().required().valid('guest','user', 'admin', 'superAdmin'),
    }),
};

const getUsers = { 
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
      })  
};

const getUser = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const updateUser = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            sex: Joi.string(),
            bio: Joi.string(),
            username: Joi.string().regex(/^(?=[a-zA-Z0-9._]{3,10}$)/),
            // username: Joi.string().regex(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/),

        }),
};


const deleteUser = {
    query: Joi.object().keys({
      userId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
    setAvatar,
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};