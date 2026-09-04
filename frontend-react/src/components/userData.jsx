import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";

export default function UserData() {

    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState("me");

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


    return (
        <>
            {
                user == null ? (

                    <div>
                        <Link
                            to="/signin"
                            className="text-white hover:text-gray-300"
                        >
                            Login
                        </Link>

                        <span className="text-white">
                            {" | "}
                        </span>

                        <Link
                            to="/register"
                            className="text-white hover:text-gray-300"
                        >
                            Register
                        </Link>
                    </div>

                ) : (

                    <div className="text-white">

                        <img
                            src={user.image}
                            className="w-6 h-6 rounded-full inline-block mr-2"
                        />

                        <select
                            className="bg-transparent border-b inline-block bg-accent"
                            value={selectedOption}
                            onChange={(e) => {

                                const value = e.target.value;

                                setSelectedOption(value);

                                if (value === "settings") {

                                    toast.success(
                                        "Settings selected"
                                    );

                                    navigate("/settings");
                                }

                                if (value === "my-orders") {

                                    toast.success(
                                        "My Orders selected"
                                    );

                                    navigate("/my-orders");
                                }

                                if (value === "logout") {

                                    localStorage.removeItem("token");

                                    setUser(null);

                                    toast.success(
                                        "Logged out successfully"
                                    );

                                    navigate("/");
                                }

                                setSelectedOption("me");
                            }}
                        >

                            <option value="me">
                                {user.firstName}
                            </option>

                            <option
                                className="bg-accent"
                                value="settings"
                            >
                                Settings
                            </option>

                            <option
                                className="bg-accent"
                                value="my-orders"
                            >
                                My Orders
                            </option>

                            <option
                                className="bg-accent"
                                value="logout"
                            >
                                Logout
                            </option>

                        </select>

                    </div>

                )
            }
        </>
    );
}