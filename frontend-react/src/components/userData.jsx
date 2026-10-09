import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { CiLogin } from "react-icons/ci";

/* ---------- Animated Logout Confirm Modal ---------- */
function LogoutConfirmModal({ onCancel, onConfirm }) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Play exit animation, then unmount
    const handleClose = () => {
        if (loading) return;
        setVisible(false);
        setTimeout(onCancel, 200);
    };

    // Enter animation + Esc key support
    useEffect(() => {
        const frame = requestAnimationFrame(() => setVisible(true));
        const onKey = (e) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("keydown", onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const handleConfirm = async () => {
        setLoading(true);
        // short delay so the spinner is visible
        await new Promise((resolve) => setTimeout(resolve, 600));
        onConfirm();
    };

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm
                        transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                className={`w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300
                            ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-90 opacity-0"}`}
            >
                {/* Animated icon */}
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-100 opacity-75" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </span>
                </div>

                <h2 className="mb-1 text-center text-lg font-semibold text-gray-800">Log out?</h2>
                <p className="mb-6 text-center text-sm text-gray-500">
                    You'll need to sign in again to access your account.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-600
                                   transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100
                                   active:scale-95 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r
                                   from-red-500 to-red-600 px-4 py-2.5 font-medium text-white
                                   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                                   hover:shadow-red-500/30 active:scale-95 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Logging out
                            </>
                        ) : (
                            "Log out"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- UserData ---------- */
export default function UserData() {

    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState("me");
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token != null) {

            api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Failed to load user data:", error);
                    setUser(null);
                });

        }

    }, []);

    function confirmLogout() {
        localStorage.removeItem("token");
        setUser(null);
        setShowLogoutConfirm(false);
        toast.success("Logged out successfully");
        navigate("/");
    }

    return (
        <>
            {
                user == null ? (

                    <div className="lg:flex">
                        <Link
                            to="/signin"
                            className="text-white hidden lg:block hover:text-gray-300"
                        >
                            Login
                        </Link>

                        <span className="text-white hidden lg:block">
                            {" | "}
                        </span>

                        <Link
                            to="/signup"
                            className="text-white hidden lg:block hover:text-gray-300"
                        >
                            Register
                        </Link>

                        <Link to="/signin" className="h-full flex flex-col lg:hidden justify-center items-center text-accent text-3xl">
                            <CiLogin />
                            <span className="text-xs text-accent">Login</span>
                        </Link>
                    </div>

                ) : (

                    <div className="text-white flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-4">

                        <img
                            src={user.image}
                            className="w-6 h-6 rounded-full inline-block mr-2"
                        />

                        <select
                            className="bg-transparent  text-sm text-accent text-center lg:text-white"
                            value={selectedOption}
                            onChange={(e) => {

                                const value = e.target.value;

                                setSelectedOption(value);

                                if (value === "settings") {

                                    navigate("/settings");
                                }

                                if (value === "my-orders") {

                                    navigate("/my-orders");
                                }

                                if (value === "logout") {

                                    setShowLogoutConfirm(true);
                                }

                                setSelectedOption("me");
                            }}
                        >

                            <option value="me">
                                {user.firstName}
                            </option>

                            <option
                                className="bg-accent text-white"
                                value="settings"
                            >
                                Settings
                            </option>

                            <option
                                className="bg-accent text-white"
                                value="my-orders"
                            >
                                My Orders
                            </option>

                            <option
                                className="bg-accent text-white"
                                value="logout"
                            >
                                Logout
                            </option>

                        </select>

                    </div>

                )
            }

            {showLogoutConfirm && (
                <LogoutConfirmModal
                    onCancel={() => setShowLogoutConfirm(false)}
                    onConfirm={confirmLogout}
                />
            )}
        </>
    );
}