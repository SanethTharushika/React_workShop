import { Link, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { BsGift } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx";
import LogoutConfirmModal from "../components/LogoutConfirmModal.jsx";
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

    const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "";
    const initial = user ? (user.firstName || user.email || "A").charAt(0).toUpperCase() : "";

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

            {/* Bottom: logged-in admin + logout */}
            <div className="mt-auto border-t border-gray-100 p-3">

                {user && (
                    <div className="mb-2 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt="Profile"
                                className="h-9 w-9 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                                {initial}
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">{fullName || "Admin"}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onLogout}
                    className="group flex w-full items-center gap-3 rounded-lg border-l-4 border-transparent px-4 py-3 text-xl
                               text-red-500 transition-all duration-300 hover:translate-x-1 hover:border-red-500
                               hover:bg-red-50 hover:shadow-md active:scale-95"
                >
                    <FiLogOut className="transition-transform duration-300 group-hover:scale-125" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [user, setUser] = useState(null);
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
                console.error("Failed to load user data:", error);

                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                } else {
                    toast.error("Failed to load your account. Please sign in again.");
                }

                navigate("/signin", { replace: true });
            });
    }, [navigate]);

    function openLogoutConfirm() {
        setMenuOpen(false);
        setShowLogoutConfirm(true);
    }

    function confirmLogout() {
        localStorage.removeItem("token");
        setUser(null);
        setShowLogoutConfirm(false);
        setMenuOpen(false);
        toast.success("Logged out successfully");
        navigate("/signin", { replace: true });
    }

    return (
        <div className="fixed inset-0 flex w-full flex-col overflow-hidden bg-primary lg:flex-row">

            {/* Mobile top bar */}
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

                <button
                    type="button"
                    aria-label="Log out"
                    onClick={openLogoutConfirm}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-red-500
                               transition active:scale-90"
                >
                    <FiLogOut />
                </button>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden h-full w-[300px] shrink-0 bg-white shadow-2xl lg:block">
                <SidebarContent user={user} onNavigate={() => {}} onLogout={openLogoutConfirm} />
            </aside>

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
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
                {user == null ? (
                    <LoadingScreen />
                ) : (
                    <div className="min-h-0 min-w-0 flex-1">
                        <Routes>
                            <Route index element={<AdminOrdersPage />} />
                            <Route path="products" element={<AdminProductPage />} />
                            <Route path="users" element={<AdminUsersPage />} />
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