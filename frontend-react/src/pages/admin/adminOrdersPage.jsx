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

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();


    useEffect(() => {

        const token = localStorage.getItem("token");

        setLoading(true);

        api.get(
            "/orders/" + pageNumber + "/" + pageSize,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {

                console.log(
                    "Orders response:",
                    response.data
                );

                setOrders(
                    response.data.orders || []
                );

                setTotalOrders(
                    response.data.totalOrders || 0
                );

                setTotalPages(
                    response.data.totalPages || 1
                );

            })
            .catch((error) => {

                console.error(
                    "Failed to load orders:",
                    error
                );

                if (
                    error?.response?.status === 401
                ) {

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
                setTotalPages(1);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [navigate, pageNumber, pageSize]);


    if (loading) {

        return <LoadingScreen />;

    }


    return (

        <div className="w-full h-full p-5 flex flex-col items-center">


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


            {/* Orders Table */}

            {
                orders.length === 0 ? (

                    <div
                        className="
                            w-full
                            text-center
                            text-gray-500
                            text-xl
                        "
                    >
                        No orders found
                    </div>

                ) : (

                    <table
                        className="
                            w-full
                            text-center
                            overflow-hidden
                            rounded-lg
                            bg-white
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

                            {
                                orders.map((order) => {

                                    const firstItem =
                                        order.items?.[0];

                                    return (

                                        <tr
                                            key={order._id}
                                            className="
                                                odd:bg-gray-300
                                                even:bg-white
                                            "
                                        >

                                            <td className="p-3">

                                                {
                                                    order.orderId
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    firstItem?.email ||
                                                    "N/A"
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    firstItem
                                                        ? `${firstItem.firstName} ${firstItem.lastName}`
                                                        : "N/A"
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    firstItem?.city ||
                                                    "N/A"
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    firstItem?.phone ||
                                                    "N/A"
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    firstItem?.status ||
                                                    "N/A"
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    firstItem?.date
                                                        ? new Date(
                                                            firstItem.date
                                                        )
                                                            .toLocaleDateString()
                                                        : "N/A"
                                                }

                                            </td>


                                            <td className="p-3">

                                                {
                                                    getFormattedPrice(
                                                        order.totalAmount
                                                    )
                                                }

                                            </td>


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

                                })
                            }

                        </tbody>

                    </table>

                )
            }


            {/* Pagination */}

            <div
                className="
                    p-4
                    mt-10
                    mb-5
                    bg-white
                    shadow-2xl
                    rounded-lg
                    flex
                    justify-center
                    items-center
                    gap-4
                    fixed bottom-4
                "
            >

                {/* Page Size */}

                <select
                    value={pageSize}
                    onChange={(e) => {

                        setPageSize(
                            Number(e.target.value)
                        );

                        setPageNumber(1);

                    }}
                    className="
                        w-[150px]
                        h-[40px]
                        bg-white
                        text-black
                        border
                        border-gray-300
                        rounded-lg
                        px-2
                    "
                >

                    <option value={2}>
                        2 per page
                    </option>

                    <option value={5}>
                        5 per page
                    </option>

                    <option value={10}>
                        10 per page
                    </option>

                    <option value={20}>
                        20 per page
                    </option>

                </select>


                {/* Previous */}

                <button
                    disabled={pageNumber === 1}
                    onClick={() => {

                        setPageNumber(
                            (previousPage) =>
                                previousPage - 1
                        );

                    }}
                    className="
                        px-4
                        py-2
                        bg-gray-300
                        rounded-lg
                        hover:bg-gray-400
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    Previous
                </button>


                {/* Page Number */}

                <span className="font-medium">

                    Page {pageNumber} of {totalPages}

                </span>


                {/* Next */}

                <button
                    disabled={
                        pageNumber >= totalPages
                    }
                    onClick={() => {

                        setPageNumber(
                            (previousPage) =>
                                previousPage + 1
                        );

                    }}
                    className="
                        px-4
                        py-2
                        bg-gray-300
                        rounded-lg
                        hover:bg-gray-400
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    Next
                </button>

            </div>

        </div>
    );
}