import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCheckCircle, FiShield, FiSlash, FiUser, FiUsers } from "react-icons/fi";
import api from "../../utils/api";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import SearchInput from "../../components/admin/SearchInput.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import TableSkeleton, { CardSkeleton } from "../../components/admin/TableSkeleton.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

function fullName(user) {
    return [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unnamed user";
}

/* Profile picture, with the first letter as a fallback when it is missing or fails to load */
function Avatar({ user, className = "h-10 w-10" }) {
    const [failed, setFailed] = useState(false);
    const initial = (user.firstName || user.email || "?").charAt(0).toUpperCase();

    if (user.image && !failed) {
        return (
            <img
                src={user.image}
                alt=""
                onError={() => setFailed(true)}
                className={`${className} shrink-0 rounded-full object-cover`}
            />
        );
    }

    return (
        <span
            className={`${className} flex shrink-0 items-center justify-center rounded-full bg-accent
                        text-sm font-semibold text-white`}
        >
            {initial}
        </span>
    );
}

const actionTones = {
    accent: "border-slate-200 text-slate-600 hover:border-accent hover:bg-blue-50 hover:text-accent",
    red: "border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50",
    green: "border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50",
};

function ActionButton({ icon, tone = "accent", disabled, title, onClick, children }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border bg-white px-3 py-1.5
                        text-xs font-semibold transition-all duration-200 active:scale-95
                        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white
                        ${actionTones[tone]}`}
        >
            {icon}
            {children}
        </button>
    );
}

export default function AdminUsersPage({ currentUser }) {

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // initialLoad: first load (skeleton). fetching: any load (dims the table while changing pages)
    const [initialLoad, setInitialLoad] = useState(true);
    const [fetching, setFetching] = useState(true);

    const [search, setSearch] = useState("");

    // The action waiting for confirmation: { type: "role" | "block", user }
    const [pending, setPending] = useState(null);
    const [acting, setActing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        setFetching(true);

        api.get(`/users/all/${pageNumber}/${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setUsers(response.data.users || []);
                setTotalUsers(response.data.totalUsers || 0);
                setTotalPages(response.data.totalPages || 1);
            })
            .catch((error) => {

                console.error("Failed to load users:", error);

                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                    navigate("/signin", { replace: true });
                    return;
                }

                toast.error(error?.response?.data?.message || "Failed to load users");

                setUsers([]);
                setTotalUsers(0);
                setTotalPages(1);
            })
            .finally(() => {
                setFetching(false);
                setInitialLoad(false);
            });

    }, [navigate, pageNumber, pageSize, refreshTrigger]);

    // Compare with the logged-in admin so nobody can change their own role or block themselves
    function isSelf(user) {
        return Boolean(currentUser?.email) && user.email === currentUser.email;
    }

    async function confirmPending() {

        if (!pending || acting) return;

        const { type, user } = pending;

        if (isSelf(user)) {
            setPending(null);
            return;
        }

        const token = localStorage.getItem("token");
        const url = (type === "role" ? "/users/role/" : "/users/state/") + encodeURIComponent(user.email);

        setActing(true);

        try {
            await api.put(url, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success(type === "role" ? "User role updated successfully." : "User status updated successfully.");
            setPending(null);
            setRefreshTrigger((value) => value + 1);

        } catch (error) {

            console.error("Failed to update user:", error);

            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                toast.error("Session expired. Please sign in again.");
                navigate("/signin", { replace: true });
                return;
            }

            toast.error(
                error?.response?.data?.message ||
                (type === "role" ? "Failed to update user role." : "Failed to update user status.")
            );
            setPending(null);

        } finally {
            setActing(false);
        }
    }

    // Text for the confirmation popup
    function dialogProps() {

        const { type, user } = pending;

        const details = (
            <>
                <p className="font-semibold text-gray-800">{fullName(user)}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
            </>
        );

        if (type === "role") {
            return user.isAdmin
                ? {
                    title: "Change role to User?",
                    message: "This person will lose access to the admin panel.",
                    confirmText: "Make user",
                    variant: "default",
                    children: details,
                }
                : {
                    title: "Make this user an admin?",
                    message: "They will get full access to the admin panel, including products, orders and users.",
                    confirmText: "Make admin",
                    variant: "default",
                    children: details,
                };
        }

        return user.isBlocked
            ? {
                title: "Unblock this user?",
                message: "They will be able to sign in and place orders again.",
                confirmText: "Unblock",
                variant: "default",
                children: details,
            }
            : {
                title: "Block this user?",
                message: "They will no longer be able to sign in or place orders until you unblock them.",
                confirmText: "Block",
                variant: "danger",
                children: (
                    <>
                        {details}
                        {user.isAdmin && (
                            <p className="mt-2 text-xs font-medium text-red-600">This user is an admin.</p>
                        )}
                    </>
                ),
            };
    }

    // Search works on the users of the current page
    const term = search.trim().toLowerCase();
    const visibleUsers = term
        ? users.filter((user) =>
            `${user.firstName || ""} ${user.lastName || ""} ${user.email || ""}`.toLowerCase().includes(term)
        )
        : users;

    function renderActions(user) {

        const self = isSelf(user);

        return (
            <div className="flex flex-wrap items-center gap-2">
                <ActionButton
                    icon={user.isAdmin ? <FiUser /> : <FiShield />}
                    disabled={self}
                    title={self ? "You can't change your own role" : user.isAdmin ? "Make this user a normal user" : "Make this user an admin"}
                    onClick={() => setPending({ type: "role", user })}
                >
                    {user.isAdmin ? "Make user" : "Make admin"}
                </ActionButton>

                <ActionButton
                    tone={user.isBlocked ? "green" : "red"}
                    icon={user.isBlocked ? <FiCheckCircle /> : <FiSlash />}
                    disabled={self}
                    title={self ? "You can't block your own account" : user.isBlocked ? "Unblock this user" : "Block this user"}
                    onClick={() => setPending({ type: "block", user })}
                >
                    {user.isBlocked ? "Unblock" : "Block"}
                </ActionButton>
            </div>
        );
    }

    const roleBadge = (user) => (
        <StatusBadge tone={user.isAdmin ? "purple" : "gray"}>{user.isAdmin ? "Admin" : "User"}</StatusBadge>
    );

    const verifiedBadge = (user) => (
        <StatusBadge tone={user.isEmailVerified ? "green" : "amber"}>
            {user.isEmailVerified ? "Verified" : "Not verified"}
        </StatusBadge>
    );

    const statusBadge = (user) => (
        <StatusBadge tone={user.isBlocked ? "red" : "green"}>{user.isBlocked ? "Blocked" : "Active"}</StatusBadge>
    );

    const noUsersAtAll = !initialLoad && users.length === 0;
    const noSearchMatch = !initialLoad && users.length > 0 && visibleUsers.length === 0;

    return (
        <div className="mx-auto w-full max-w-7xl pb-6">

            <AdminPageHeader
                title="All Users"
                subtitle="Manage roles and access for every account."
                count={totalUsers}
                countLabel="Users"
            />

            {/* Search */}
            <div className="mb-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name or email"
                    label="Search users"
                    className="w-full sm:max-w-sm"
                />
                {term && (
                    <p className="mt-2 text-xs text-slate-500">
                        Searching users on this page (page {pageNumber} of {totalPages}).
                    </p>
                )}
            </div>

            {/* ---------- Desktop table ---------- */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <table className="w-full text-left text-sm">

                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-semibold">User</th>
                            <th className="px-4 py-3 font-semibold">Role</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className={`transition-opacity duration-200 ${fetching && !initialLoad ? "opacity-50" : "opacity-100"}`}>

                        {initialLoad && <TableSkeleton rows={6} columns={5} />}

                        {!initialLoad && visibleUsers.map((user) => (
                            <tr
                                key={user._id || user.email}
                                className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar user={user} />
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-800">{fullName(user)}</p>
                                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{roleBadge(user)}</td>
                                <td className="px-4 py-3">{verifiedBadge(user)}</td>
                                <td className="px-4 py-3">{statusBadge(user)}</td>
                                <td className="px-4 py-3">{renderActions(user)}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {noUsersAtAll && (
                    <EmptyState
                        icon={<FiUsers />}
                        title="No users found"
                        message="Users will appear here once they register."
                    />
                )}

                {noSearchMatch && (
                    <EmptyState
                        icon={<FiUsers />}
                        title="No matching users"
                        message="No user on this page matches your search."
                        action={
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-all
                                           duration-200 hover:brightness-110 active:scale-95"
                            >
                                Clear search
                            </button>
                        }
                    />
                )}
            </div>

            {/* ---------- Mobile cards ---------- */}
            <div className="md:hidden">

                {initialLoad && <CardSkeleton count={4} />}

                {!initialLoad && (
                    <div className={`space-y-3 transition-opacity duration-200 ${fetching ? "opacity-50" : "opacity-100"}`}>

                        {visibleUsers.map((user) => (
                            <div
                                key={user._id || user.email}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar user={user} className="h-12 w-12" />
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-800">{fullName(user)}</p>
                                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {roleBadge(user)}
                                    {verifiedBadge(user)}
                                    {statusBadge(user)}
                                </div>

                                <div className="mt-4 border-t border-slate-100 pt-3">{renderActions(user)}</div>
                            </div>
                        ))}

                        {noUsersAtAll && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <EmptyState
                                    icon={<FiUsers />}
                                    title="No users found"
                                    message="Users will appear here once they register."
                                />
                            </div>
                        )}

                        {noSearchMatch && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <EmptyState
                                    icon={<FiUsers />}
                                    title="No matching users"
                                    message="No user on this page matches your search."
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination (under the table, not floating) */}
            {!initialLoad && totalUsers > 0 && (
                <Pagination
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalItems={totalUsers}
                    totalPages={totalPages}
                    onPageChange={setPageNumber}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPageNumber(1);
                    }}
                />
            )}

            {/* Confirmation popup for role and block changes */}
            {pending && (
                <ConfirmDialog
                    {...dialogProps()}
                    loading={acting}
                    onConfirm={confirmPending}
                    onCancel={() => setPending(null)}
                />
            )}

        </div>
    );
}