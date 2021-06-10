const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const publicController = require('../../controllers/public.controller');

const router = express.Router();

router
    .route('/')
        .get(auth('public'), publicController.getCountDocuments)

module.exports = router;