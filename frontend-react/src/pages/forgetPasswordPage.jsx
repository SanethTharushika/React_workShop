import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen";


export default function ForgetPasswordPage() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    function verifyOTP() {

    }
    
    function sendOTP() {
        setLoading(true);
        api.post("/users/otp", { email: email }).then((res) => {
            console.log(res);
            setLoading(false);
            toast.success("OTP sent to your email");
            setOtpSent(true);

        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.message || "Login failed");
            setLoading(false);
        })

    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[url('/login-bg.jpg')] ">
            {
                loading && <LoadingScreen/>
            }

            {otpSent ? 
            <div className="w-[400px] h-[400px] backdrop-blur-md  shadow-lg rounded-lg flex flex-col justify-center items-center gap-4">
                <h1 className="text-2xl font-semibold text-white">Enter Your Email</h1>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@gmail.com" className="w-[80%] h-10 rounded-md px-2 text-white border border-white" />
                <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder="Enter OTP" className="w-[80%] h-10 rounded-md px-2 text-white border border-white" />
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Enter New Password" className="w-[80%] h-10 rounded-md px-2 text-white border border-white" />
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm New Password" className="w-[80%] h-10 rounded-md px-2 text-white border border-white" />
                <button disabled={loading} onClick={verifyOTP} className="w-[80%] h-10 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600">Submit</button>
            </div>
            :
             <div className="w-[400px] h-[400px] backdrop-blur-md  shadow-lg rounded-lg flex flex-col justify-center items-center gap-4">
                <h1 className="text-2xl font-semibold text-white">Enter Your Email</h1>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@gmail.com" className="w-[80%] h-10 rounded-md px-2 text-white border border-white" />
                <button disabled={loading} onClick={sendOTP} className="w-[80%] h-10 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600">Submit</button>
            </div>
            }
        </div>
    )
}