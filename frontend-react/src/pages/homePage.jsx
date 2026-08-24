import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Header from "../components/header.jsx";
import ProductsPage from "./productsPage.jsx";
import OverviewPage from "./overviewPage.jsx";

export default function HomePage() {
    return (
        <div className="w-full min-h-screen bg-primary text-secondary">

            <Header/>

            <div className="h-[calc(100vh-100px)] w-full">

            <Routes>
                <Route path="/" element={<h1>Home Page</h1>}/>
                {/* products */}
                <Route path="/products" element={<ProductsPage/>}/>
                {/* Contact us */}
                <Route path="/contact-us" element={<h1>Contact Us Page</h1>}/>
                {/* About us */}
                <Route path="/about-us" element={<h1>About Us Page</h1>}/>

                <Route path="/overview" element={<OverviewPage/>}/>



                <Route path="/*" element={<h1>404 Not Found</h1>}/>
                
            </Routes>
            </div>
        </div>
    )
}