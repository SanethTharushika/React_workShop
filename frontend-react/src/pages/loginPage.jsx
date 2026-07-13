import { MdEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";


export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        toast.success("Email: " + email + " Password: " + password);

        try {

            const response =await axios.post("http://localhost:3000/users/login",
                {
                    email: email,
                    password: password
                }
            )
           
        } catch (error) {
            toast.error("Invalid email or password");
           
        }
    }

    return (
        <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">

            <div className="w-[400px] h-[500px] backdrop-blur-md shadow-2xl shadow-white rounded-lg flex flex-col  p-4">

                <h1 className="text-4xl text-center font-bold text-white my-5">Login</h1>

                <div className="w-full">

                    <label className="text-white text-lg flex items-center gap-2"><MdEmail />Email</label>
                    <input
                        onChange={
                            (e) => {
                                
                                setEmail(e.target.value);
                            }
                        }
                        value={email}
                        className="w-full h-[40px] rounded-lg px-2 border border-white text-white mb-2" type="email" placeholder="user@example.com" />


                </div>

                <div className="w-full">

                    <label className="text-white text-lg flex items-center gap-2"><MdPassword />Password</label>
                    <input
                        onChange={
                            (e) => {
                               
                                setPassword(e.target.value);
                            }
                        }
                        value={password} type="password"
                        className="w-full h-[40px] rounded-lg px-2 border border-white text-white mb-2" type="password" placeholder="********" />


                </div>

                <p className="w-full h-2 text-white text-lg my-2">Forget your Password? click <Link to="/forget-password" className="font-bold">here</Link></p>

                <button className="w-full h-[40px] bg-[#18c3cd] text-white rounded-lg mt-5 border border-white" onClick={handleLogin}>Sign In</button>

                <p className="w-full h-2 text-white text-lg ">Don't have an account? click <Link to="/signup" className="font-bold">here</Link></p>

                <button className="w-full h-[40px] bg-black text-white rounded-lg flex justify-center items-center gap-2 mt-8 border border-white" onClick={handleLogin}><FaGoogle />Sign In with Google</button>


            </div>

        </div>
    )
}