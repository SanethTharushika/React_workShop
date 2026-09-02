import { useState } from "react";
import { IoMdEye, IoMdClose } from "react-icons/io";
import { getFormattedPrice } from "../utils/price-formatter.jsx";

export default function AdminOrderDataModel({ order }) {

    const [isOpen, setIsOpen] = useState(false);

    const firstItem = order?.items?.[0];

    return (
        <>
            <IoMdEye
                className="text-2xl text-gray-500 cursor-pointer hover:text-blue-600"
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
                <div className="w-screen h-screen fixed left-0 top-0 bg-black/70 flex justify-center items-center z-50">

                    <div className="w-[650px] max-h-[90vh] bg-gray-100 rounded-xl overflow-hidden flex flex-col">

                        <div className="w-full bg-white p-5 relative">

                            <IoMdClose
                                className="absolute right-5 top-5 text-3xl cursor-pointer text-gray-500 hover:text-red-500"
                                onClick={() => setIsOpen(false)}
                            />

                            <h2 className="text-2xl font-bold mb-4">
                                Order Details
                            </h2>

                            <div className="grid grid-cols-2 gap-3">

                                <p>
                                    <b>Order ID:</b> {order?.orderId || "N/A"}
                                </p>

                                <p>
                                    <b>Status:</b> {firstItem?.status || "N/A"}
                                </p>

                                <p>
                                    <b>Name:</b>{" "}
                                    {firstItem
                                        ? `${firstItem.firstName} ${firstItem.lastName}`
                                        : "N/A"}
                                </p>

                                <p>
                                    <b>Email:</b> {firstItem?.email || "N/A"}
                                </p>

                                <p>
                                    <b>Phone:</b> {firstItem?.phone || "N/A"}
                                </p>

                                <p>
                                    <b>City:</b> {firstItem?.city || "N/A"}
                                </p>

                                <p>
                                    <b>Address:</b> {firstItem?.addressLine1 || "N/A"}
                                </p>

                                <p>
                                    <b>Date:</b>{" "}
                                    {firstItem?.date
                                        ? new Date(firstItem.date).toLocaleDateString()
                                        : "N/A"}
                                </p>

                            </div>

                        </div>


                        <div className="w-full max-h-[400px] overflow-y-auto p-4 flex flex-col gap-4">

                            {order?.items?.map((item, index) => {

                                console.log("ORDER ITEM:", item);

                                const product = item?.product;

                                return (
                                    <div
                                        key={index}
                                        className="w-full min-h-[120px] bg-white rounded-lg flex gap-4 p-4 shadow"
                                    >

                                        <div className="w-[100px] h-[90px] flex-shrink-0">

                                            <img
                                                src={product?.image || ""}
                                                alt={product?.name || "Product"}
                                                className="w-full h-full object-cover rounded-lg"
                                            />

                                        </div>

                                        <div className="w-full flex flex-col justify-between">

                                            <h3 className="font-bold text-lg">
                                                {product?.name || "No product name"}
                                            </h3>

                                            <p className="text-gray-500">
                                                Product ID: {product?.productId || "N/A"}
                                            </p>

                                            <p className="text-gray-500">
                                                Quantity: {item?.quantity || 0}
                                            </p>

                                            <p className="text-gray-500">
                                                Unit Price:{" "}
                                                {getFormattedPrice(product?.price || 0)}
                                            </p>

                                            <p className="font-bold">
                                                Subtotal:{" "}
                                                {getFormattedPrice(
                                                    (product?.price || 0) *
                                                    (item?.quantity || 0)
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>


                        <div className="w-full bg-white p-5 flex justify-between items-center">

                            <span className="text-lg font-semibold">
                                Total Amount
                            </span>

                            <span className="text-xl font-bold">
                                {getFormattedPrice(order?.totalAmount || 0)}
                            </span>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}