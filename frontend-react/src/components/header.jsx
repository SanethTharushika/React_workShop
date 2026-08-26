import { Link } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";

export default function Header() {
    return (
        <header className="w-full h-[100px] bg-accent flex justify-between  p-6">
            
            <Link to="/">
                <img src="/logo.jpg" className="w-full h-full object-cover rounded-lg" />
            </Link>
            <div className="h-full flex justify-center items-center gap-4">
                <Link to="/" className="h-full flex justify-center items-center text-white hover:text-gray-300">Home</Link>
                <Link to="/products" className="h-full flex justify-center items-center text-white hover:text-gray-300">Products</Link>
                <Link to="/contact-us" className="h-full flex justify-center items-center text-white hover:text-gray-300">Contact Us</Link>

            </div>
            <div className="">

                <Link to="/cart" className="h-full w-full flex justify-center items-center text-white hover:text-gray-300">
                    <BsCart3 size={24} />
                </Link>
            </div>
            

            
            
        </header>
    )
}