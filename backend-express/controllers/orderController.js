import Order from "../models/order.js";
import Product from "../models/product.js";


export async function createOrder(req, res) {

    try {

        if (req.user == null) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const orderData = {
            orderId: "ORD000001",
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

            const productItem = await Product.findOne({ productId: req.body.items[i].productId })

            if (productItem == null) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " not found" });
                return;
            }
            if (productItem.isAvailable == false) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " is not available" });
                return;
            }
            if (productItem.stock < req.body.items[i].quantity) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " does not have enough stock" });
                return;
            }

            orderData.items.push({
                product: {
                    productId: productItem.productId,
                    name: productItem.name,
                    image: productItem.image[0],
                    price: productItem.price,
                    labelledPrice: productItem.labelledPrice
                },
                email: req.body.email || req.user.email,
                firstName: req.body.firstName || req.user.firstName,
                lastName: req.body.lastName || req.user.lastName,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2,
                city: req.body.city,
                phone: req.body.phone,
                quantity: req.body.items[i].quantity
            });

            orderData.totalAmount += productItem.price * req.body.items[i].quantity;
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.json({ message: "Order created successfully", orderId: newOrder.orderId });

        for (let i = 0; i < req.body.items.length; i++) {
            const productItem = await Product.findOne({ productId: req.body.items[i].productId })
            productItem.stock -= req.body.items[i].quantity;
            await productItem.save();
        }




    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export async function getAllOrders(req, res) {

    if (req.user == null) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {

        if (req.user.isAdmin) {

            const pageSizeInString = req.query.pageSize || "10";

            const pageNumberInString = req.query.pageNumber || "1";

            const pageSize = parseInt(pageSizeInString);

            const pageNumber = parseInt(pageNumberInString);

            const orderCount = await Order.countDocuments();

            const totalPages = Math.ceil(orderCount / pageSize);

            const orders = await Order.find().sort({ date: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize);
            res.json({
                orders: orders,
                totalPages: totalPages,
                currentPage: pageNumber,
                totalOrders: orderCount

            });
        } else {

            const pageSizeInString = req.query.pageSize || "10";

            const pageNumberInString = req.query.pageNumber || "1";

            const pageSize = parseInt(pageSizeInString);

            const pageNumber = parseInt(pageNumberInString);

            const orderCount = await Order.countDocuments({ email: req.user.email });

            const totalPages = Math.ceil(orderCount / pageSize);

            const orders = await Order.find({ email: req.user.email }).sort({ date: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize);
            res.json({
                orders: orders,
                totalPages: totalPages,
                currentPage: pageNumber,
                totalOrders: orderCount

            });




        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}



