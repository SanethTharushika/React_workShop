import { MdEmail, MdPassword } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const googlelogin = useGoogleLogin(
        {
            onSuccess: (response) => {
                console.log(response);

                api.post("/users/google-login", {
                    accessToken: response.access_token
                }).then((res) => {
                    console.log(res.data);
                    localStorage.setItem("token", res.data.token);
                    if (res.data.isAdmin) {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }

                }).catch((err) => {
                    console.log(err);
                })
            },
            onError: (error) => {
            console.log(error);
            }  
        } 

    )

    

    async function handleRegister(event) {

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        
        setLoading(true);

        try {

            await api.post(
                "/users/",
                {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                }
            );

            navigate("/signin");

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Registration failed"
            );

        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">

            <form
                onSubmit={handleRegister}
                className="w-[400px] min-h-[500px] backdrop-blur-md bg-black/25 shadow-2xl shadow-white/30 rounded-2xl flex flex-col p-6 border border-white/20"
            >

                <h1 className="text-4xl text-center font-bold text-white my-5">
                    Register
                </h1>


                {/* Email */}

                <div className="w-full">

                    <label className="text-white text-lg flex items-center gap-2 mb-1">
                        <MdEmail />
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        placeholder="user@example.com"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        className="
                            w-full
                            h-[45px]
                            rounded-lg
                            px-3
                            border
                            border-white/70
                            bg-black/20
                            text-white
                            placeholder:text-gray-300
                            mb-3
                            outline-none

                            transition-all
                            duration-300
                            ease-out

                            hover:scale-[1.03]
                            hover:border-[#18c3cd]
                            hover:bg-black/30
                            hover:shadow-xl
                            hover:shadow-cyan-400/30

                            focus:scale-[1.03]
                            focus:border-[#18c3cd]
                            focus:bg-black/30
                            focus:ring-2
                            focus:ring-[#18c3cd]/30
                            focus:shadow-xl
                            focus:shadow-cyan-400/30
                        "
                    />

                </div>

                <div className="w-full mt-5 flex flex-row gap-2">

                    <div className="w-1/2">

                        <label className="text-white text-lg flex items-center gap-2 mb-1">First Name</label>
                        <input className="w-full h-[40px] rounded-md px-2 border border-white text-white" type="text" placeholder="Saneth"
                            onChange={
                                (e) => {
                                    setFirstName(e.target.value);
                                }
                            }
                            
                            value={firstName}

                            ></input>

                    </div>

                    <div className="w-1/2">

                        <label className="text-white text-lg flex items-center gap-2 mb-1">Last Name</label>
                        <input className="w-full h-[40px] rounded-md px-2 border border-white text-white" type="text"  placeholder="Siriwardhana"
                            onChange={
                                (e) => {
                                    setLastName(e.target.value);
                                }
                            }
                            value={lastName}
                            ></input>

                    </div>

                </div>


                {/* Password */}

                <div className="w-full">

                    <label className="text-white text-lg flex items-center gap-2 mb-1">
                        <MdPassword />
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        placeholder="********"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        className="
                            w-full
                            h-[45px]
                            rounded-lg
                            px-3
                            border
                            border-white/70
                            bg-black/20
                            text-white
                            placeholder:text-gray-300
                            mb-3
                            outline-none

                            transition-all
                            duration-300
                            ease-out

                            hover:scale-[1.03]
                            hover:border-[#18c3cd]
                            hover:bg-black/30
                            hover:shadow-xl
                            hover:shadow-cyan-400/30

                            focus:scale-[1.03]
                            focus:border-[#18c3cd]
                            focus:bg-black/30
                            focus:ring-2
                            focus:ring-[#18c3cd]/30
                            focus:shadow-xl
                            focus:shadow-cyan-400/30
                        "
                    />

                </div>

                                <div className="w-full">

                    <label className="text-white text-lg flex items-center gap-2 mb-1">
                        <MdPassword />
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder="********"
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                        className="
                            w-full
                            h-[45px]
                            rounded-lg
                            px-3
                            border
                            border-white/70
                            bg-black/20
                            text-white
                            placeholder:text-gray-300
                            mb-3
                            outline-none

                            transition-all
                            duration-300
                            ease-out

                            hover:scale-[1.03]
                            hover:border-[#18c3cd]
                            hover:bg-black/30
                            hover:shadow-xl
                            hover:shadow-cyan-400/30

                            focus:scale-[1.03]
                            focus:border-[#18c3cd]
                            focus:bg-black/30
                            focus:ring-2
                            focus:ring-[#18c3cd]/30
                            focus:shadow-xl
                            focus:shadow-cyan-400/30
                        "
                    />

                </div>



                {/* Sign In Button */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full
                        h-[45px]
                        bg-[#18c3cd]
                        text-white
                        font-semibold
                        rounded-lg
                        mt-5
                        border
                        border-white/40

                        transition-all
                        duration-300
                        ease-out

                        hover:scale-[1.04]
                        hover:bg-[#13aab3]
                        hover:shadow-xl
                        hover:shadow-cyan-400/40

                        active:scale-[0.97]

                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >

                    {
                        loading
                            ? "Loading..."
                            : "Sign Up"
                    }

                </button>


                {/* Register */}

                <p className="text-white text-sm mt-4">

                    Already have an account?{" "}

                    <Link
                        to="/signin"
                        className="font-bold text-[#18c3cd] hover:underline"
                    >
                        Click here to login
                    </Link>

                </p>


                {/* Divider */}

                <div className="flex items-center gap-3 my-5">

                    <div className="h-[1px] bg-white/30 flex-1"></div>

                    <span className="text-white/70 text-sm">
                        OR
                    </span>

                    <div className="h-[1px] bg-white/30 flex-1"></div>

                </div>


                {/* Google Button */}

                <button onClick={() => googlelogin()}
                    className="
                        w-full
                        h-[45px]
                        bg-[#18c3cd]
                        text-white
                        rounded-lg
                        flex
                        justify-center
                        items-center
                        gap-2
                        border
                        border-white/40

                        transition-all
                        duration-300
                        ease-out

                        hover:scale-[1.04]
                        hover:bg-[#13aab3]
                        hover:shadow-xl
                        hover:shadow-cyan-400/40

                        active:scale-[0.97]
                    "
                >

                    <FaGoogle />

                    Sign In with Google

                </button>

            </form>

        </div>
    );
}