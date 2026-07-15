import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";


export default function AdminProductPage() {
    return (
        <div className="w-full h-full ">
           
           <Link to="/admin/add-product" className="bg-accent w-[80px] h-[80px] rounded-full text-white text-4xl flex justify-center items-center fixed bottom-5 right-5 shadow-2xl hover:bg-black "><IoIosAdd/></Link>
        </div>
    )
}