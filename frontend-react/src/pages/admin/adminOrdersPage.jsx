import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";
import api from "../../utils/api";
import { getFormattedPrice } from "../../utils/price-formatter.jsx";
import AdminOrderDataModel from "../../components/orderDataModel.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import SearchInput from "../../components/admin/SearchInput.jsx";
import StatusBadge, { orderStatusTone } from "../../components/admin/StatusBadge.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import TableSkeleton, { CardSkeleton } from "../../components/admin/TableSkeleton.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";

/* The customer details live on the first item of the order */
function customerOf(order) {
    const first = order.items?.[0] || {};

    return {
        name: [first.firstName, first.lastName].filter(Boolean).join(" ") || "N/A",
        email: first.email || "N/A",
        city: first.city || "",
        phone: first.phone || "",
        status: first.status || "",
        date: first.date,
    };
}

function formatDate(value) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function OrderStatus({ status }) {
    if (!status) return <StatusBadge tone="gray">N/A</StatusBadge>;

    return (
        <StatusBadge tone={orderStatusTone(status)}>
            <span className="capitalize">{status}</span>
        </StatusBadge>
    );
}

export default function AdminOrdersPage() {

    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // initialLoad: first load (skeleton). fetching: any load (dims the table while changing pages)
    const [initialLoad, setInitialLoad] = useState(true);
    const [fetching, setFetching] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        setFetching(true);

        api.get(`/orders/${pageNumber}/${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setOrders(response.data.orders || []);
                setTotalOrders(response.data.totalOrders || 0);
                setTotalPages(response.data.totalPages || 1);
            })
            .catch((error) => {

                console.error("Failed to load orders:", error);

                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                    navigate("/signin", { replace: true });
                    return;
                }

                toast.error(error?.response?.data?.message || "Failed to load orders");

                setOrders([]);
                setTotalOrders(0);
                setTotalPages(1);
            })
            .finally(() => {
                setFetching(false);
                setInitialLoad(false);
            });

    }, [navigate, pageNumber, pageSize, refreshTrigger]);

    // Status options come from the orders on this page
    const statuses = useMemo(
        () => [...new Set(orders.map((order) => customerOf(order).status).filter(Boolean))],
        [orders]
    );

    const activeStatus = statusFilter === "All" || statuses.includes(statusFilter) ? statusFilter : "All";

    const term = search.trim().toLowerCase();

    // Search and filter work on the orders of the current page
    const visibleOrders = useMemo(
        () =>
            orders.filter((order) => {
                const customer = customerOf(order);

                if (activeStatus !== "All" && customer.status !== activeStatus) return false;
                if (!term) return true;

                return `${order.orderId} ${customer.name} ${customer.email}`.toLowerCase().includes(term);
            }),
        [orders, activeStatus, term]
    );

    const filtersActive = term !== "" || activeStatus !== "All";

    function clearFilters() {
        setSearch("");
        setStatusFilter("All");
    }

    function refresh() {
        setRefreshTrigger((value) => value + 1);
    }

    function renderModal(order) {
        return (
            <AdminOrderDataModel
                isAdmin={true}
                order={order}
                refresh={refresh}
            />
        );
    }

    const noOrdersAtAll = !initialLoad && orders.length === 0;
    const noMatch = !initialLoad && orders.length > 0 && visibleOrders.length === 0;

    const clearFiltersButton = (
        <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-all duration-200
                       hover:brightness-110 active:scale-95"
        >
            Clear filters
        </button>
    );

    return (
        <div className="mx-auto w-full max-w-7xl pb-6">

            <AdminPageHeader
                title="All Orders"
                subtitle="Track and manage customer orders."
                count={totalOrders}
                countLabel="Orders"
            />

            {/* Search + status filter */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by order ID, name or email"
                    label="Search orders"
                    className="w-full sm:max-w-sm"
                />

                <select
                    aria-label="Filter by status"
                    value={activeStatus}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm capitalize text-slate-700
                               outline-none transition focus:border-accent focus:ring-4 focus:ring-blue-100"
                >
                    <option value="All">All statuses</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {filtersActive && (
                <p className="-mt-1 mb-3 text-xs text-slate-500">
                    Searching and filtering orders on this page (page {pageNumber} of {totalPages}).
                </p>
            )}

            {/* ---------- Desktop table ---------- */}
            {/* overflow-clip keeps the rounded corners without breaking the sticky header */}
            <div className="hidden overflow-clip rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <table className="w-full text-left text-sm">

                    <thead className="text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            {["Order", "Customer", "Status", "Date", "Total", "Actions"].map((heading) => (
                                <th
                                    key={heading}
                                    className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold shadow-[0_1px_0_0_#e2e8f0]"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className={`transition-opacity duration-200 ${fetching && !initialLoad ? "opacity-50" : "opacity-100"}`}>

                        {initialLoad && <TableSkeleton rows={6} columns={6} />}

                        {!initialLoad && visibleOrders.map((order) => {

                            const customer = customerOf(order);

                            return (
                                <tr
                                    key={order._id || order.orderId}
                                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 font-semibold text-slate-800">{order.orderId}</td>

                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-slate-800">{customer.name}</p>
                                        <p className="text-xs text-slate-500">{customer.email}</p>
                                        {(customer.city || customer.phone) && (
                                            <p className="text-xs text-slate-400">
                                                {[customer.city, customer.phone].filter(Boolean).join(" · ")}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-3"><OrderStatus status={customer.status} /></td>

                                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(customer.date)}</td>

                                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                                        {getFormattedPrice(order.totalAmount)}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center">{renderModal(order)}</div>
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>

                {noOrdersAtAll && (
                    <EmptyState
                        icon={<FiShoppingCart />}
                        title="No orders found"
                        message="Orders will appear here once customers place them."
                    />
                )}

                {noMatch && (
                    <EmptyState
                        icon={<FiShoppingCart />}
                        title="No matching orders"
                        message="No order on this page matches your search or filter."
                        action={clearFiltersButton}
                    />
                )}
            </div>

            {/* ---------- Mobile cards ---------- */}
            <div className="md:hidden">

                {initialLoad && <CardSkeleton count={4} />}

                {!initialLoad && (
                    <div className={`space-y-3 transition-opacity duration-200 ${fetching ? "opacity-50" : "opacity-100"}`}>

                        {visibleOrders.map((order) => {

                            const customer = customerOf(order);

                            return (
                                <div
                                    key={order._id || order.orderId}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-800">{order.orderId}</p>
                                            <p className="text-xs text-slate-500">{formatDate(customer.date)}</p>
                                        </div>
                                        <OrderStatus status={customer.status} />
                                    </div>

                                    <div className="mt-3">
                                        <p className="font-medium text-slate-800">{customer.name}</p>
                                        <p className="truncate text-xs text-slate-500">{customer.email}</p>
                                        {(customer.city || customer.phone) && (
                                            <p className="text-xs text-slate-400">
                                                {[customer.city, customer.phone].filter(Boolean).join(" · ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                        <p className="font-bold text-slate-900">{getFormattedPrice(order.totalAmount)}</p>
                                        {renderModal(order)}
                                    </div>
                                </div>
                            );
                        })}

                        {noOrdersAtAll && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <EmptyState
                                    icon={<FiShoppingCart />}
                                    title="No orders found"
                                    message="Orders will appear here once customers place them."
                                />
                            </div>
                        )}

                        {noMatch && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <EmptyState
                                    icon={<FiShoppingCart />}
                                    title="No matching orders"
                                    message="No order on this page matches your search or filter."
                                    action={clearFiltersButton}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination (under the table, not floating) */}
            {!initialLoad && totalOrders > 0 && (
                <Pagination
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalItems={totalOrders}
                    totalPages={totalPages}
                    onPageChange={setPageNumber}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPageNumber(1);
                    }}
                />
            )}

        </div>
    );
}