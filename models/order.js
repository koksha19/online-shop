const mongoose = require('mongoose');

const Schema = mongoose.Schemal

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Object,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ],
    user: {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            req: 'User',
        },
    },
})

module.exports = mongoose.model('Order', orderSchema);