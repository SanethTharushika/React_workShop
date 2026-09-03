import { Link } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import UserData from "./userData.jsx";

export default function Header() {

    return (
        <header className="w-full h-[100px] bg-accent flex items-center justify-between px-6">

            {/* Logo */}
            <Link to="/" className="w-[70px] h-[70px]">
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                />
            </Link>


            {/* Navigation */}
            <div className="h-full flex justify-center items-center gap-6">

                <Link
                    to="/"
                    className="text-white hover:text-gray-300"
                >
                    Home
                </Link>

                <Link
                    to="/products"
                    className="text-white hover:text-gray-300"
                >
                    Products
                </Link>

                <Link
                    to="/contact-us"
                    className="text-white hover:text-gray-300"
                >
                    Contact Us
                </Link>

            </div>


            {/* Cart + User */}
            <div className="flex items-center gap-5">

                <Link
                    to="/cart"
                    className="flex items-center justify-center text-white hover:text-gray-300"
                >
                    <BsCart3 size={24} />
                </Link>

                <UserData />

            </div>

        </header>
    );
}