import Order from "../models/order.js";
import Product from "../models/product.js";


export async function createOrder(req, res) {

    try {

        if (req.user == null) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }


        // Generate next order ID
        let orderId = "ORD000001";

        const lastOrder = await Order.findOne()
            .sort({ orderId: -1 });

        if (lastOrder != null) {

            const lastOrderId = lastOrder.orderId;

            const lastOrderNumberInString =
                lastOrderId.replace("ORD", "");

            const lastOrderNumber =
                parseInt(lastOrderNumberInString);

            const newOrderNumber =
                lastOrderNumber + 1;

            const newOrderNumberInString =
                newOrderNumber
                    .toString()
                    .padStart(6, "0");

            orderId =
                "ORD" + newOrderNumberInString;
        }


        // Validate order items
        if (
            !req.body.items ||
            !Array.isArray(req.body.items) ||
            req.body.items.length === 0
        ) {
            return res.status(400).json({
                message: "Order must contain at least one item"
            });
        }


        const orderData = {
            orderId: orderId,
            items: [],
            totalAmount: 0
        };


        // Process products
        for (let i = 0; i < req.body.items.length; i++) {

            const requestedItem = req.body.items[i];

            const productItem = await Product.findOne({
                productId: requestedItem.productId
            });


            // Product not found
            if (productItem == null) {

                return res.status(400).json({
                    message:
                        "Product with id " +
                        requestedItem.productId +
                        " not found"
                });
            }


            // Product unavailable
            if (productItem.isAvailable === false) {

                return res.status(400).json({
                    message:
                        "Product with id " +
                        requestedItem.productId +
                        " is not available"
                });
            }


            // Invalid quantity
            if (
                requestedItem.quantity == null ||
                requestedItem.quantity <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid quantity for product " +
                        requestedItem.productId
                });
            }


            // Insufficient stock
            if (
                productItem.stock <
                requestedItem.quantity
            ) {

                return res.status(400).json({
                    message:
                        "Product with id " +
                        requestedItem.productId +
                        " does not have enough stock"
                });
            }


            // Add item according to Order model
            orderData.items.push({

                product: {
                    productId: productItem.productId,
                    name: productItem.name,
                    image: productItem.image?.[0] || "",
                    price: productItem.price,
                    labelledPrice: productItem.labelledPrice
                },

                email:
                    req.body.email ||
                    req.user.email,

                firstName:
                    req.body.firstName ||
                    req.user.firstName,

                lastName:
                    req.body.lastName ||
                    req.user.lastName,

                addressLine1:
                    req.body.addressLine1,

                addressLine2:
                    req.body.addressLine2,

                city:
                    req.body.city,

                phone:
                    req.body.phone,

                quantity:
                    requestedItem.quantity
            });


            // Calculate total
            orderData.totalAmount +=
                productItem.price *
                requestedItem.quantity;
        }


        // Save order
        const newOrder = new Order(orderData);

        await newOrder.save();


        // Reduce product stock
        for (let i = 0; i < req.body.items.length; i++) {

            const requestedItem =
                req.body.items[i];

            const productItem =
                await Product.findOne({
                    productId:
                        requestedItem.productId
                });


            productItem.stock -=
                requestedItem.quantity;


            await productItem.save();
        }


        // Success response
        return res.status(201).json({

            message:
                "Order created successfully",

            orderId:
                newOrder.orderId,

            order:
                newOrder
        });


    } catch (error) {

        console.error(error);


        // Duplicate Order ID
        if (error.code === 11000) {

            return res.status(409).json({
                message:
                    "Duplicate order ID. Please try again."
            });
        }


        return res.status(500).json({
            message: error.message
        });
    }
}



export async function getAllOrders(req, res) {

    // Check authentication
    if (req.user == null) {

        return res.status(401).json({
            message: "Unauthorized"
        });
    }


    try {

        // =========================
        // PAGINATION
        // =========================

        // Route:
        // /orders/:pageNumber/:pageSize

        const pageNumber =
            parseInt(req.params.pageNumber || "1");

        const pageSize =
            parseInt(req.params.pageSize || "10");


        console.log("Page Number:", pageNumber);
        console.log("Page Size:", pageSize);


        // Validate pagination values
        if (
            isNaN(pageNumber) ||
            pageNumber < 1
        ) {

            return res.status(400).json({
                message: "Invalid page number"
            });
        }


        if (
            isNaN(pageSize) ||
            pageSize < 1
        ) {

            return res.status(400).json({
                message: "Invalid page size"
            });
        }


        // =========================
        // ADMIN
        // =========================

        if (req.user.isAdmin) {

            const orderCount =
                await Order.countDocuments();


            const totalPages =
                Math.max(
                    1,
                    Math.ceil(
                        orderCount / pageSize
                    )
                );


            const orders =
                await Order.find()
                    .sort({
                        orderId: -1
                    })
                    .skip(
                        (pageNumber - 1) *
                        pageSize
                    )
                    .limit(pageSize);


            return res.status(200).json({

                orders:
                    orders,

                totalPages:
                    totalPages,

                currentPage:
                    pageNumber,

                pageSize:
                    pageSize,

                totalOrders:
                    orderCount
            });
        }


        // =========================
        // NORMAL USER
        // =========================

        // email is inside items
        const filter = {
            "items.email":
                req.user.email
        };


        const orderCount =
            await Order.countDocuments(
                filter
            );


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    orderCount / pageSize
                )
            );


        const orders =
            await Order.find(filter)
                .sort({
                    orderId: -1
                })
                .skip(
                    (pageNumber - 1) *
                    pageSize
                )
                .limit(pageSize);


        return res.status(200).json({

            orders:
                orders,

            totalPages:
                totalPages,

            currentPage:
                pageNumber,

            pageSize:
                pageSize,

            totalOrders:
                orderCount
        });


    } catch (error) {

        console.error(
            "Get all orders error:",
            error
        );


        return res.status(500).json({
            message: error.message
        });
    }
}