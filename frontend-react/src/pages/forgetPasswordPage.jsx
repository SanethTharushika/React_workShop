export default function ForgetPasswordPage() {
    return (
        <div className="w-full h-screen flex justify-center items-center bg-[url('/login-bg.jpg')] ">
            <div className="w-[400px] h-[400px] backdrop-blur-md  shadow-lg rounded-lg flex flex-col justify-center items-center gap-4">
                <h1 className="text-2xl font-semibold text-white">Enter Your Email</h1>
                <input type="email" placeholder="user@gmail.com" className="w-[80%] h-10 rounded-md px-2 text-white border border-white" />
                <button className="w-[80%] h-10 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600">Submit</button>
            </div>
        </div>
    )
}