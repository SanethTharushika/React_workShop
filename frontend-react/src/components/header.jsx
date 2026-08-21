import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="w-full h-[100px] bg-accent flex justify-between  p-6">
            
            <Link to="/">
                <img src="/logo.jpg" className="w-full h-full object-cover rounded-lg" />
            </Link>
            <div className="h-full bg-white w-[300px]">

            </div>
            <div className="h-full bg-white w-[300px]">

            </div>
            
        </header>
    )
}