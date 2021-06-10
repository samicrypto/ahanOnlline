const Joi = require('joi');
const { password } = require('./custom.validation');


const register = {
    body: Joi.object().keys({
        username: Joi.string().required(), // /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/
        password: Joi.string().required().min(1),
    })
};

const verification = {
  body: Joi.object().keys({
    username: Joi.string().required(), // /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/
    password: Joi.string().required().min(1),
    verifyCode: Joi.number().required(),
    messageId: Joi.string().required(),
  }),
};

const login = {
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().min(1),
    }),
};

const loginAdmin = {
  body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required().min(1),
  }),
};

const logout = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
};

const refreshTokens = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
};
  
const forgotPassword = {
    body: Joi.object().keys({
      phoneNumber: Joi.string().required(),
    }),
};

const resetPassword = {
    body: Joi.object().keys({
      phoneNumber: Joi.string().required(),
      newPassword: Joi.string().required().custom(password),
      verifyCode: Joi.number().required(),
      messageId: Joi.number().required()
    }),
};

module.exports = {
    register,
    verification,
    login,
    loginAdmin,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
};