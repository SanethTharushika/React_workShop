import { Link, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { BsGift } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx";
import AdminProductPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProductForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage.jsx";

function SidebarLink({ to, icon, label, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
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

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token != null) {
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
                        navigate("/");
                    }
                })
                .catch((error) => {
                    console.error("Failed to load user data:", error);
                    setUser(null);
                });
        } else {
            toast.error("You are not authorized to access this page.");
            navigate("/login");
        }
    }, []);

    return (
        <div className="w-full min-h-screen bg-primary flex">
            {/* Sidebar */}
            <div className="w-[300px] min-h-screen bg-white flex flex-col shadow-2xl">
                <Link to="/admin" className="w-full h-[100px] block overflow-hidden">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                </Link>

                <div className="mt-4 flex flex-col">
                    <SidebarLink to="/admin" end icon={<FiShoppingCart />} label="Orders" />
                    <SidebarLink to="/admin/products" icon={<BsGift />} label="Products" />
                    <SidebarLink to="/admin/users" icon={<FaRegUser />} label="Users" />
                </div>
            </div>

            {/* Content */}
            <div className="w-[calc(100%-300px)] min-h-screen p-4 flex">
                {user == null ? (
                    <LoadingScreen />
                ) : (
                    <Routes>
                        <Route index element={<AdminOrdersPage />} />
                        <Route path="products" element={<AdminProductPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="add-product" element={<AdminAddProductForm />} />
                        <Route path="edit-product" element={<AdminEditProductForm />} />
                    </Routes>
                )}
            </div>
        </div>
    );
}