import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { CiLogin } from "react-icons/ci";

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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm transition-transform duration-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Log out?</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            You'll need to sign in again to access your account.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600
                                           transition-all duration-200 hover:bg-gray-100 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium
                                           transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-95"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}