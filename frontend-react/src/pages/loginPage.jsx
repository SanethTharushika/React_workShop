import { MdEmail, MdPassword } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin() {

        setLoading(true);

        try {

            const response = await api.post(
                "/users/login",
                {
                    email: email,
                    password: password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            if (response.data.isAdmin) {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Login failed"
            );

        }

        setLoading(false);
    }

    return (

        <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">

            <div className="w-[400px] min-h-[500px] backdrop-blur-md bg-black/25 shadow-2xl shadow-white/30 rounded-2xl flex flex-col p-6 border border-white/20">

                <h1 className="text-4xl text-center font-bold text-white my-5">
                    Login
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


                {/* Forgot Password */}

                <p className="text-white text-sm mt-1">

                    Forgot your password?{" "}

                    <Link
                        to="/forget-password"
                        className="font-bold text-[#18c3cd] hover:underline"
                    >
                        Click here
                    </Link>

                </p>


                {/* Sign In Button */}

                <button
                    disabled={loading}
                    onClick={handleLogin}
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
                            : "Sign In"
                    }

                </button>


                {/* Register */}

                <p className="text-white text-sm mt-4">

                    Don't have an account?{" "}

                    <Link
                        to="/signup"
                        className="font-bold text-[#18c3cd] hover:underline"
                    >
                        Register
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

                <button
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

            </div>

        </div>
    );
}