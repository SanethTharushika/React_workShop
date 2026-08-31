import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/loadingScreen.jsx";
import { getFormattedPrice } from "../../utils/price-formatter.jsx";


export default function AdminOrdersPage() {

    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    useEffect(() => {

        const token = localStorage.getItem("token");

       api.get("/orders/1/10",  {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {

                console.log("Orders response:", response.data);

                setOrders(response.data.orders);

                setTotalOrders(response.data.totalOrders);
            })
            .catch((error) => {

                console.error(
                    "Failed to load orders:",
                    error
                );

                if (error?.response?.status === 401) {

                    localStorage.removeItem("token");

                    toast.error(
                        "Session expired. Please sign in again."
                    );

                    navigate("/signin");

                    return;
                }

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load orders"
                );

                setOrders([]);
                setTotalOrders(0);
            })
            .finally(() => {

                setLoading(false);

            });

    }, [navigate]);


    if (loading) {
        return <LoadingScreen />;
    }


    return (

        <div className="w-full h-full p-5">


            {/* Header */}

            <div
                className="
                    w-full
                    h-[100px]
                    bg-white
                    shadow-2xl
                    mb-10
                    rounded-lg
                    flex
                    p-4
                    items-center
                    justify-between
                "
            >

                <h1 className="text-2xl font-semibold">
                    All Orders
                </h1>

                <div className="h-full gap-4 flex items-center">

                    {totalOrders} Orders

                </div>

            </div>


            {/* No Orders */}

            {orders.length === 0 ? (

                <div className="w-full text-center text-gray-500 text-xl">

                    No orders found

                </div>

            ) : (

                <table
                    className="
                        w-full
                        text-center
                        overflow-hidden
                        rounded-lg
                    "
                >

                    <thead
                        className="
                            h-[40px]
                            bg-accent
                            text-white
                            font-semibold
                        "
                    >

                        <tr>

                            <td className="w-[5%]">
                                Order ID
                            </td>

                            <td className="w-[10%]">
                                Email
                            </td>

                            <td className="w-[15%]">
                                Name
                            </td>

                            <td className="w-[8%]">
                                City
                            </td>

                            <td className="w-[10%]">
                                Phone
                            </td>

                            <td className="w-[8%]">
                                Status
                            </td>

                            <td className="w-[12%]">
                                Date
                            </td>

                            <td className="w-[12%]">
                                Total Amount
                            </td>

                            <td className="w-[10%]">
                                Actions
                            </td>

                        </tr>

                    </thead>


                    <tbody>

                        {orders.map((order) => {

                            // Customer/order details are stored
                            // inside the first item in your schema
                            const firstItem = order.items?.[0];

                            return (

                                <tr
                                    key={order._id}
                                    className="odd:bg-gray-300"
                                >

                                    {/* Order ID */}

                                    <td className="p-3">

                                        {order.orderId}

                                    </td>


                                    {/* Email */}

                                    <td className="p-3">

                                        {firstItem?.email || "N/A"}

                                    </td>


                                    {/* Customer Name */}

                                    <td className="p-3">

                                        {firstItem
                                            ? `${firstItem.firstName} ${firstItem.lastName}`
                                            : "N/A"
                                        }

                                    </td>


                                    {/* City */}

                                    <td className="p-3">

                                        {firstItem?.city || "N/A"}

                                    </td>


                                    {/* Phone */}

                                    <td className="p-3">

                                        {firstItem?.phone || "N/A"}

                                    </td>


                                    {/* Status */}

                                    <td className="p-3">

                                        {firstItem?.status || "N/A"}

                                    </td>


                                    {/* Date */}

                                    <td className="p-3">

                                        {firstItem?.date
                                            ? new Date(
                                                firstItem.date
                                            ).toLocaleDateString()
                                            : "N/A"
                                        }

                                    </td>


                                    {/* Total Amount */}

                                    <td className="p-3">

                                        {getFormattedPrice(
                                            order.totalAmount
                                        )}

                                    </td>


                                    {/* Actions */}

                                    <td className="p-3">

                                        <button
                                            className="
                                                bg-blue-500
                                                text-white
                                                px-4
                                                py-2
                                                rounded-lg
                                                hover:bg-blue-700
                                            "
                                            onClick={() => {

                                                console.log(
                                                    "Selected Order:",
                                                    order
                                                );

                                            }}
                                        >

                                            View

                                        </button>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            )}

        </div>
    );
}