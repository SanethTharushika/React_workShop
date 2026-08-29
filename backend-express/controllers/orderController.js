import Order from "../models/order.js";

export async function createOrder(req, res) {

    try {

        if (req.user == null) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const orderData = {
            orderId: "ORD000001",
            firstName: req.body.firstName || req.user.firstName,
            lastName: req.body.lastName || req.user.lastName,
            email: req.body.email,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            phone: req.body.phone,
            items: [],
            totalAmount: 0,


        }

        for (let i = 0; i < req.body.items.length; i++) {



            const lastOrder = await Order.findOne().sort({ date: -1 });

            if (lastOrder != null) {

                const lastOrderId = lastOrder.orderId;
                const lastOrderNumberInString = lastOrderId.replace("ORD", "");
                const lastOrderNumber = parseInt(lastOrderNumberInString);

                const newOrderNumber = lastOrderNumber + 1;
                const newOrderNumberInString = newOrderNumber.toString().padStart(6, "0");
                orderData.orderId = "ORD" + newOrderNumberInString;
            }

            const product = await product.findOne({ productId: req.boady.items[i].productId })

            if (product == null) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " not found" });
                return;
            }
            if (product.isAvailable == false) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " is not available" });
                return;
            }
            if (product.stock < req.body.items[i].quantity) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " does not have enough stock" });
                return;
            }

            orderData.items.push({
                product: {
                    productId: product.productId,
                    name: product.name,
                    image: product.image[0],
                    price: product.price,
                    labelledPrice: product.labelledPrice
                },
                quantity: req.body.items[i].quantity

            });

            orderData.totalAmount += product.price * req.body.items[i].quantity;
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.json({ message: "Order created successfully", orderId: newOrder.orderId });

        for (let i = 0; i < req.body.items.length; i++) {
            const product = await product.findOne({ productId: req.boady.items[i].productId })
            product.stock -= req.body.items[i].quantity;
            await product.save();
        }




    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

} 
