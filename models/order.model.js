const mongoose = require('mongoose');
const {toJSON, paginate } = require('./plugins');


const orderSchema = mongoose.Schema(
    {
        poster: {
            type: String,
            // required: true,
        },
        foodId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            trim: true,
            required: true
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            // required: true
        }
    }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('order', orderSchema);

module.exports = Order;