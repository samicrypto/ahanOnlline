const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
    .route('/')
        .get(auth('getOrder'), validate(orderValidation.getOrder), orderController.getOrders)
        .post(auth('manageOrder'), validate(orderValidation.createOrder), orderController.createOrder);

     .get(auth('getOrder'), orderController.getUserChannels);

router
    .route('/:orderId')
        .get(auth('getOrder'), validate(orderValidation.getOrder), orderController.getOrder)
        .patch(auth('manageOrder'), validate(orderValidation.updateFood), orderController.updateOrder)
        .delete(auth('manageOrder'), validate(orderValidation.deleteOrder), orderController.deleteOrder)

router
    .route('/search/:channelTitle')
        .get(auth('getOrder'), validate(orderValidation.searchOrder), orderController.searchOrder)
        

module.exports = router;