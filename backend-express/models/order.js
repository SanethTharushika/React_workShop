import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [
        {
            product: {
                productId: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                labelledPrice: {
                    type: Number,
                    required: true,
                },



            },
            email: {
                type: String,
                required: true,
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            addressLine1: {
                type: String,
                required: true,
            },
            addressLine2: {
                type: String,
                required: false,

            },
            city: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                required: true,
                default: "pending",
            } ,
            date: {
                type: Date,
                required: true,
                default: Date.now,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    }
  }
)

const Order = mongoose.model('Order', orderSchema);

export default Order;