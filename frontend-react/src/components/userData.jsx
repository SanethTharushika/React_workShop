import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { CiLogin } from "react-icons/ci";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";



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

                    <div className="flex items-center">

                        {/* Desktop */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                to="/signin"
                                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-md
                       transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                       hover:shadow-accent/40 hover:brightness-110 active:scale-95"                            >
                                Login
                                <span className="absolute bottom-1 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-md
                       transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                       hover:shadow-accent/40 hover:brightness-110 active:scale-95"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Mobile */}
                        <Link
                            to="/signin"
                            className="flex h-full flex-col items-center justify-center gap-0.5 text-3xl text-accent
                   transition-all duration-200 active:scale-90 lg:hidden"
                        >
                            <CiLogin className="transition-transform duration-300 hover:translate-x-0.5" />
                            <span className="text-xs font-medium text-accent">Login</span>
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