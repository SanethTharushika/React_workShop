import { useEffect, useState } from "react";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen.jsx";
import uploadMedia from "../utils/mediaUpload.js";


export default function Settings() {

    const [user, setUser] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token != null) {

            api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    setUser(response.data);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                })
                .catch((error) => {
                    console.error("Failed to load user data:", error);
                    setUser(null);
                });

        } else {
            window.location.href = "/login";

        }

    }, []);


    async function handleUpdateProfile() {

        setLoading(true);

        let imageUrl = user.image;

        try {
            if (image != null) {

                imageUrl = await uploadMedia(image);

            }
            const token = localStorage.getItem("token");
            await api.put("/users", {
                firstName: firstName,
                lastName: lastName,
                image: imageUrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setLoading(false);
            window.location.reload();

        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile. Please try again.");
            setLoading(false);
        }




    }

    async function handleUpdatePassword() {

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await api.post("/users/password", {
                password: password
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            toast.success("Password updated successfully.");
            window.location.reload();

        } catch (error) {
            console.error("Failed to update password:", error);
            toast.error("Failed to update password. Please try again.");
            setLoading(false);
        }


    }

    return (
        <div className="w-full h-full overflow-y-scroll pb-20 flex flex-col lg:flex-row justify-center items-center gap-4" >
            <div className="w-[400px] p-4 h-[400px] bg-white shadow-2xl rounded-lg flex flex-col" >
                <h1 className="font-semibold text-2xl mb-4">Profile Information</h1>
                <label className="text-sm font-medium">First Name</label>
                <input type="text" className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4" value={firstName}
                    onChange={
                        (e) => {
                            setFirstName(e.target.value)
                        }
                    } />

                <label className="text-sm font-medium">Last Name</label>
                <input type="text" className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4" value={lastName}
                    onChange={
                        (e) => {
                            setLastName(e.target.value)
                        }
                    } />

                <label className="text-sm font-medium">Profile Image</label>
                <input type="file" className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
                    onChange={
                        (e) => {
                            setImage(e.target.files[0])
                        }
                    } />

                <button className="w-full p-4 h-[40px] bg-accent text-white font-semibold rounded-md hover:bg-accent/80 shadow-2xl flex items-center justify-center"
                    onClick={handleUpdateProfile}
                >
                    Update Profile
                </button>


            </div>


            <div className="w-[400px] p-4 h-[400px] bg-white shadow-2xl rounded-lg" >
                <h1 className="font-semibold text-2xl mb-4">Change Password</h1>
                <lable className="text-sm font-medium">New Password</lable>
                <input type="password" className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4" value={password}
                    onChange={
                        (e) => {
                            setPassword(e.target.value)
                        }
                    } />

                <lable className="text-sm font-medium">Confirm Password</lable>
                <input type="password" className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4" value={confirmPassword}
                    onChange={
                        (e) => {
                            setConfirmPassword(e.target.value)
                        }
                    } />

                <button className="w-full p-4 h-[40px] bg-accent text-white font-semibold rounded-md hover:bg-accent/80 shadow-2xl flex items-center justify-center"
                    onClick={handleUpdatePassword}
                >
                    Update Password
                </button>

            </div>
            {
                loading && <LoadingScreen />
            }
        </div>
    )
}