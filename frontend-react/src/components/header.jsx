import { Link } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import UserData from "./userData.jsx";
import { IoHomeOutline, IoCubeOutline, IoCartOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";

export default function Header() {

    return (

        <>
        <header className="w-full h-[100px] bg-accent flex items-center justify-center lg:justify-between px-6">

            {/* Logo */}
            <Link to="/" className="w-[70px] h-[70px]">
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                />
            </Link>


            {/* Navigation */}
            <div className="h-full hidden lg:flex justify-center items-center gap-6">

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
            <div className="justify-center items-center gap-4 hidden lg:flex">

                <Link
                    to="/cart"
                    className="flex items-center justify-center text-white hover:text-gray-300"
                >
                    <BsCart3 size={24} />
                </Link>

                <UserData />

            </div>

        </header>

        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white shadow-2xl flex lg:hidden justify-evenly items-center ">
            <Link to="/" className="h-full flex flex-col justify-center items-center text-accent text-3xl">
                <IoHomeOutline/>
                <span className="text-xs text-accent">Home</span>
            </Link>

            <Link to="/products" className="h-full flex flex-col justify-center items-center text-accent text-3xl">
                <IoCubeOutline/>
                <span className="text-xs text-accent">Products</span>
            </Link>

            <Link to="/cart" className="h-full flex flex-col justify-center items-center text-accent text-3xl">
                <IoCartOutline/>
                <span className="text-xs text-accent">Cart</span>
            </Link>

            <Link to="/contact-us" className="h-full flex flex-col justify-center items-center text-accent text-3xl">
                <CiPhone/>
                <span className="text-xs text-accent">Contact Us</span>
            </Link>

            <UserData/>

        </div>

        </>
    );
}