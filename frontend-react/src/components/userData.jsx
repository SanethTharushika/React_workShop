
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiUser,
    FiSettings,
    FiPackage,
    FiLogOut,
    FiShield,
    FiChevronDown,
    FiX
} from "react-icons/fi";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";

export default function UserData() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    const navigate = useNavigate();

    // Fetch the currently logged-in user
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data);
            setImageFailed(false);

        } catch (error) {
            console.error("Failed to load user data:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
            }

            setUser(null);

        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load user and listen for authentication changes
    useEffect(() => {
        fetchUser();

        const handleAuthChange = () => {
            setIsMenuOpen(false);
            fetchUser();
        };

        const handleStorageChange = (event) => {
            if (event.key === "token") {
                handleAuthChange();
            }
        };

        window.addEventListener("auth-changed", handleAuthChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("auth-changed", handleAuthChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [fetchUser]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, []);

    // Close menu with Escape and support arrow-key navigation
    function handleMenuKeyDown(event) {
        const menuItems = menuRef.current?.querySelectorAll(
            '[role="menuitem"]:not([disabled])'
        );

        if (!menuItems?.length) return;

        const items = Array.from(menuItems);
        const currentIndex = items.indexOf(document.activeElement);

        if (event.key === "Escape") {
            event.preventDefault();
            setIsMenuOpen(false);
            triggerRef.current?.focus();
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            items[(currentIndex + 1) % items.length].focus();
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            items[(currentIndex - 1 + items.length) % items.length].focus();
        }

        if (event.key === "Home") {
            event.preventDefault();
            items[0].focus();
        }

        if (event.key === "End") {
            event.preventDefault();
            items[items.length - 1].focus();
        }
    }

    function openMenu() {
        setIsMenuOpen((previous) => !previous);
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function confirmLogout() {
        localStorage.removeItem("token");

        setUser(null);
        setIsMenuOpen(false);
        setShowLogoutConfirm(false);

        window.dispatchEvent(new Event("auth-changed"));

        toast.success("Logged out successfully");

        navigate("/");
    }

    // User information
    const fullName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
        : "";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const isAdmin =
        user?.role?.toLowerCase() === "admin" ||
        user?.isAdmin === true;

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="flex items-center gap-2" aria-label="Loading user">
                <div className="h-9 w-9 animate-pulse rounded-full bg-white/20" />
                <div className="hidden h-3 w-20 animate-pulse rounded bg-white/20 lg:block" />
            </div>
        );
    }

    // Logged-out state
    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    to="/signin"
                    className="rounded-full border border-white/70 px-4 py-2
                    text-xs font-semibold text-white transition-all duration-300
                    hover:bg-white/10 focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-white lg:px-5 lg:text-sm"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="rounded-full bg-white px-4 py-2
                    text-xs font-semibold text-accent shadow-md
                    transition-all duration-300 hover:-translate-y-0.5
                    hover:shadow-lg active:scale-95
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-white lg:px-5 lg:text-sm"
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="relative" ref={menuRef}>

                {/* Avatar Dropdown Trigger */}
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={openMenu}
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    aria-label={`User menu for ${fullName}`}
                    className="group flex items-center gap-2 rounded-full
                    px-2 py-1.5 text-white transition-all duration-200
                    hover:bg-white/10 focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-white"
                >
                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center
                    justify-center overflow-hidden rounded-full
                    border-2 border-white/40 bg-indigo-500
                    text-sm font-bold text-white shadow-md">

                        {user.image && !imageFailed ? (
                            <img
                                src={user.image}
                                alt={`${fullName}'s profile`}
                                className="h-full w-full object-cover"
                                onError={() => setImageFailed(true)}
                            />
                        ) : (
                            <span aria-label={`${fullName} initials`}>
                                {initials || "U"}
                            </span>
                        )}
                    </div>

                    {/* Desktop Name */}
                    <span className="hidden max-w-32 truncate text-sm
                    font-semibold lg:block">
                        {user.firstName || "My Account"}
                    </span>

                    <FiChevronDown
                        className={`hidden text-white/80 transition-transform
                        duration-200 lg:block ${
                            isMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                <div
                    className={`absolute bottom-full right-0 z-50 mb-3
                    w-[min(20rem,calc(100vw-2rem))]
                    origin-bottom-right rounded-2xl border border-gray-100
                    bg-white p-2 text-gray-800 shadow-2xl
                    transition-all duration-200 ease-out
                    lg:bottom-auto lg:top-full lg:mt-3 lg:mb-0
                    lg:origin-top-right
                    ${
                        isMenuOpen
                            ? "visible translate-y-0 scale-100 opacity-100"
                            : "invisible translate-y-2 scale-95 opacity-0 pointer-events-none"
                    }`}
                    role="menu"
                    aria-label="User account menu"
                    onKeyDown={handleMenuKeyDown}
                    aria-hidden={!isMenuOpen}
                >

                    {/* Menu Header */}
                    <div className="flex items-center gap-3 rounded-xl
                    bg-slate-50 p-4">

                        <div className="flex h-12 w-12 shrink-0
                        items-center justify-center overflow-hidden
                        rounded-full border-2 border-white
                        bg-indigo-500 text-lg font-bold text-white shadow">

                            {user.image && !imageFailed ? (
                                <img
                                    src={user.image}
                                    alt={`${fullName}'s profile`}
                                    className="h-full w-full object-cover"
                                    onError={() => setImageFailed(true)}
                                />
                            ) : (
                                initials || "U"
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-gray-900">
                                {fullName}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                                {user.email}
                            </p>

                            {isAdmin && (
                                <span className="mt-1 inline-flex items-center
                                gap-1 rounded-full bg-indigo-100 px-2 py-0.5
                                text-[10px] font-semibold text-indigo-700">
                                    <FiShield size={11} />
                                    Administrator
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={closeMenu}
                            aria-label="Close menu"
                            className="rounded-full p-2 text-gray-400
                            hover:bg-gray-200 hover:text-gray-700
                            focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-indigo-500 lg:hidden"
                        >
                            <FiX size={17} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 p-1">

                        <Link
                            to="/settings"
                            role="menuitem"
                            tabIndex={isMenuOpen ? 0 : -1}
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl
                            px-3 py-3 text-sm font-medium text-gray-700
                            transition-colors hover:bg-indigo-50
                            hover:text-indigo-700 focus-visible:outline-none
                            focus-visible:bg-indigo-50 focus-visible:text-indigo-700"
                        >
                            <FiSettings size={18} />
                            Settings
                        </Link>

                        <Link
                            to="/my-orders"
                            role="menuitem"
                            tabIndex={isMenuOpen ? 0 : -1}
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl
                            px-3 py-3 text-sm font-medium text-gray-700
                            transition-colors hover:bg-indigo-50
                            hover:text-indigo-700 focus-visible:outline-none
                            focus-visible:bg-indigo-50 focus-visible:text-indigo-700"
                        >
                            <FiPackage size={18} />
                            My Orders
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                role="menuitem"
                                tabIndex={isMenuOpen ? 0 : -1}
                                onClick={closeMenu}
                                className="flex items-center gap-3 rounded-xl
                                px-3 py-3 text-sm font-medium text-gray-700
                                transition-colors hover:bg-indigo-50
                                hover:text-indigo-700 focus-visible:outline-none
                                focus-visible:bg-indigo-50 focus-visible:text-indigo-700"
                            >
                                <FiShield size={18} />
                                Admin Panel
                            </Link>
                        )}

                        <div className="my-1 border-t border-gray-100" />

                        <button
                            type="button"
                            role="menuitem"
                            tabIndex={isMenuOpen ? 0 : -1}
                            onClick={() => {
                                closeMenu();
                                setShowLogoutConfirm(true);
                            }}
                            className="flex w-full items-center gap-3
                            rounded-xl px-3 py-3 text-sm font-semibold
                            text-red-600 transition-colors hover:bg-red-50
                            focus-visible:outline-none focus-visible:bg-red-50"
                        >
                            <FiLogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation */}
            {showLogoutConfirm && (
                <LogoutConfirmModal
                    onCancel={() => setShowLogoutConfirm(false)}
                    onConfirm={confirmLogout}
                />
            )}
        </>
    );
}
