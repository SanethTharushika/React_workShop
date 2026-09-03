import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";

export default function UserData() {

const [user , setUser] = useState(null);
const [selectedOption, setSelectedOption] = useState("me");
const navigate = useNavigate();

useEffect(() => {

    const token = localStorage.getItem("token");

    if(token != null) {
        
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

   

}, []

);

    

return (
    <>
        {
            user == null ?  <div>
                <Link to="/signin" className="text-white hover:text-gray-300">Login</Link>
                <span className="text-white"> | </span>
                <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
                </div> : 
                <div className="text-white"> 

                   <img src={user.image} className="w-6 h-6 rounded-full inline-block mr-2" />
                   <select className="bg-transparent border-b inline-block bg-accent" value={selectedOption} onChange={
                            (e) => {
                            setSelectedOption(e.target.value)
                                if(e.target.value === "settings") {
                                    navigate("/settings");
                                }
                                if(e.target.value === "my-orders") {
                                    navigate("/my-orders");
                                }
                                if(e.target.value === "logout") {
                                    localStorage.removeItem("token");
                                    setUser(null);
                                    navigate("/");
                                }
                                setSelectedOption("me");
                        
                        }
                            
                        }>

                        <option value="me">{user.firstName}</option>
                        <option className="bg-accent" value="settings">Settings</option>
                        <option className="bg-accent" value="my-orders">My Orders</option>
                        <option className="bg-accent" value="logout">Logout</option>

                   </select>
                   
                </div>
        }
    </>
)
}
