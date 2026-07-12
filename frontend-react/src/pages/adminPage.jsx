import { Link, Routes, Route } from "react-router-dom"

export default function AdminPage() {
    return (
        <div className="w-full min-h-screen bg-purple-500 flex">
        
        
        <div className="w-[400px] min-h-screen bg-white flex flex-col">
            
            <a href="/admin">Orders</a>
            <a href="/admin/products">Products</a>
            <a href="/admin/users">Users</a>

            <Link to="/admin">Orders1</Link>
            <Link to="/admin/products">Products1</Link>
            <Link to="/admin/users">Users1</Link>
        </div>

        <div className="w-[calc(100%-400px)] min-h-screen bg-green-200 flex">

            <Routes>
                <Route path="/" element={<h1>Orders page</h1>} />
                <Route path="/products" element={<h1>Products page</h1>} />
                <Route path="/users" element={<h1>Users-page</h1>} />
            </Routes>

            </div>

        </div>
    )

}