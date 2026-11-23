import { Link, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { BsGift } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx";
import LogoutConfirmModal from "../components/LogoutConfirmModal.jsx";
import AdminAccountMenu from "../components/AdminAccountMenu.jsx";
import AdminProductPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProductForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage.jsx";

function SidebarLink({ to, icon, label, end = false, onClick }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                `group mx-3 my-1 px-4 py-3 rounded-lg text-xl flex items-center gap-3 border-l-4
                 transition-all duration-300 ease-in-out
                 hover:translate-x-1 hover:shadow-md active:scale-95
                 ${
                     isActive
                         ? "bg-blue-50 text-blue-600 border-blue-500 shadow-md"
                         : "text-gray-500 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500"
                 }`
            }
        >
            <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                {icon}
            </span>
            <span className="transition-all duration-300 group-hover:font-semibold group-hover:tracking-wide">
                {label}
            </span>
        </NavLink>
    );
}

/* Sidebar content, shared by the desktop sidebar and the mobile drawer */
function SidebarContent({ user, onNavigate, onLogout }) {
    return (
        <div className="flex h-full flex-col">
            <Link to="/admin" onClick={onNavigate} className="block h-[100px] w-full shrink-0 overflow-hidden">
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                />
            </Link>

            <div className="mt-4 flex flex-col">
                <SidebarLink to="/admin" end icon={<FiShoppingCart />} label="Orders" onClick={onNavigate} />
                <SidebarLink to="/admin/products" icon={<BsGift />} label="Products" onClick={onNavigate} />
                <SidebarLink to="/admin/users" icon={<FaRegUser />} label="Users" onClick={onNavigate} />
            </div>

            {/* Bottom: only the account card. Account actions (including Logout) live in its popup */}
            <div className="mt-auto border-t border-gray-100 p-3">
                <AdminAccountMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // No token: go straight to sign in (replace, so Back doesn't return here)
        if (token == null) {
            toast.error("Please sign in to access this page.");
            navigate("/signin", { replace: true });
            return;
        }

        setLoadError(false);

        api.get("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.data.isAdmin) {
                    setUser(response.data);
                } else {
                    toast.error("You are not authorized to access this page.");
                    navigate("/", { replace: true });
                }
            })
            .catch((error) => {
                const status = error?.response?.status;

                if (status === 401 || status === 403) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                    navigate("/signin", { replace: true });
                    return;
                }

                console.error("Failed to load user data:", error);
                setLoadError(true);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    // Close the mobile drawer with Esc
    useEffect(() => {
        if (!menuOpen) return;

        const onKey = (e) => {
            if (e.key === "Escape") setMenuOpen(false);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    function openLogoutConfirm() {
        setMenuOpen(false);
        setShowLogoutConfirm(true);
    }

    function confirmLogout() {
        localStorage.removeItem("token");
        setShowLogoutConfirm(false);
        setMenuOpen(false);
        toast.success("Logged out successfully");
        navigate("/signin", { replace: true });
    }

    return (
        <div className="fixed inset-0 flex w-full flex-col overflow-hidden bg-primary lg:flex-row">

            {/* Mobile top bar (logout lives in the account popup inside the drawer) */}
            <div className="flex h-14 shrink-0 items-center justify-between bg-white px-3 shadow-md lg:hidden">
                <button
                    type="button"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-600
                               transition active:scale-90"
                >
                    <FiMenu />
                </button>

                <Link to="/admin" className="h-10">
                    <img src="/logo.jpg" alt="Logo" className="h-full w-auto rounded-md object-cover" />
                </Link>

                {/* Spacer keeps the logo centered */}
                <span className="h-10 w-10" aria-hidden="true" />
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden h-full w-[300px] shrink-0 bg-white shadow-2xl lg:block">
                <SidebarContent user={user} onNavigate={() => {}} onLogout={openLogoutConfirm} />
            </aside>

            {/* Mobile drawer (hidden from the keyboard and screen readers while closed) */}
            <div
                aria-hidden={!menuOpen}
                className={`fixed inset-0 z-40 transition-[visibility] duration-300 lg:hidden
                            ${menuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}
            >
                <div
                    onClick={() => setMenuOpen(false)}
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
                                ${menuOpen ? "opacity-100" : "opacity-0"}`}
                />
                <div
                    className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300
                                ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full
                                   bg-black/50 text-lg text-white transition hover:rotate-90"
                    >
                        <FiX />
                    </button>
                    <SidebarContent
                        user={user}
                        onNavigate={() => setMenuOpen(false)}
                        onLogout={openLogoutConfirm}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 lg:p-4">
                {loadError ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                        <p className="text-gray-600">We couldn't load your account.</p>
                        <button
                            type="button"
                            onClick={() => setReloadKey((value) => value + 1)}
                            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-all
                                       duration-200 hover:brightness-110 active:scale-95"
                        >
                            Try again
                        </button>
                    </div>
                ) : user == null ? (
                    <LoadingScreen />
                ) : (
                    <div className="min-h-0 min-w-0 flex-1">
                        <Routes>
                            <Route index element={<AdminOrdersPage />} />
                            <Route path="products" element={<AdminProductPage />} />
                            <Route path="users" element={<AdminUsersPage currentUser={user} />} />
                            <Route path="add-product" element={<AdminAddProductForm />} />
                            <Route path="edit-product" element={<AdminEditProductForm />} />
                        </Routes>
                    </div>
                )}
            </div>

            {/* Logout confirmation */}
            {showLogoutConfirm && (
                <LogoutConfirmModal
                    onCancel={() => setShowLogoutConfirm(false)}
                    onConfirm={confirmLogout}
                />
            )}
        </div>
    );
}