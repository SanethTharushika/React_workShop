import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { BiRefresh } from "react-icons/bi";
import LoadingScreen from "../../components/loadingScreen.jsx";

export default function AdminUsersPage() {

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        setLoading(true);

        api.get(`/users/all/${pageNumber}/${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {

                console.log("Users response:", response.data);

                setUsers(response.data.users || []);
                setTotalUsers(response.data.totalUsers || 0);
                setTotalPages(response.data.totalPages || 1);

            })
            .catch((error) => {

                console.error("Failed to load users:", error);

                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                    navigate("/signin");
                    return;
                }

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load orders"
                );

                setUsers([]);
                setTotalUsers(0);
                setTotalPages(1);

            })
            .finally(() => {
                setLoading(false);
            });

    }, [navigate, pageNumber, pageSize, refreshTrigger]);

    if (loading) {
        return <LoadingScreen />;
    }

    function handleBlockUser(email) {
        const token = localStorage.getItem("token");
        api.put("/users/state/" + email, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log("User state updated:", response.data);
                toast.success("User state updated successfully.");
                setRefreshTrigger((previousTrigger) => previousTrigger + 1);
            })
            .catch((error) => {
                console.error("Failed to update user state:", error);
                toast.error("Failed to update user state.");
            }); 
    }

     function handleRoleToggle(email) {
        const token = localStorage.getItem("token");
        api.put("/users/role/" + email, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log("User role updated:", response.data);
                toast.success("User role updated successfully.");
                setRefreshTrigger((previousTrigger) => previousTrigger + 1);
            })
            .catch((error) => {
                console.error("Failed to update user role:", error);
                toast.error("Failed to update user role.");
            }); 
    }
    

    return (
        <div className="w-full h-full overflow-y-scroll p-5 flex flex-col items-center pb-[100px]"> 

            <div className="w-full min-h-[100px] bg-gray-300 shadow-2xl mb-10 rounded-lg flex p-4 items-center justify-between">

                <h1 className="text-2xl font-semibold">
                    All Users
                </h1>

                <div className="h-full flex items-center">
                    {totalUsers} Users
                </div>

            </div>

            {users.length === 0 ? (

                <div className="w-full text-center text-gray-500 text-xl">
                    No users found
                </div>

            ) : (

                <table className="w-full text-center overflow-hidden rounded-lg bg-white">

                    <thead className="h-[40px] bg-accent text-white font-semibold">
                        <tr>
                            <td>Profile</td>
                            <td>Email</td>
                            <td>First Name</td>
                            <td>Last Name</td>
                            <td>Role</td>
                            <td>Email Verified</td>
                            <td>Status</td>
                           
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => {

                            return (
                                <tr
                                    key={user._id}
                                    className="odd:bg-gray-300 even:bg-white"
                                >

                                    <td>
                                        <img 
                                            src = {user.image}
                                            alt = "Profile"
                                            className="w-[26px] h-[26px] rounded-full "
                                        />
                                    </td>

                                    <td className="p-3">
                                        {user.email || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        {user.firstName || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        {user.lastName || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        {user.isAdmin ? "Admin" : "User"} <BiRefresh onClick={() => handleRoleToggle(user.email)} className="inline-block ml-2 cursor-pointer text-accent hover:text-accent-dark text-xl" />
                                    </td>

                                    <td className="p-3">
                                        {user.isEmailVerified ? "Verified" : "Not verified"}
                                    </td>

                                    <td className="p-3">
                                        {user.isBlocked ? "Blocked" : "Active"} <BiRefresh onClick={() => handleBlockUser(user.email)} className="inline-block ml-2 cursor-pointer text-accent hover:text-accent-dark text-xl" />
                                    </td>

                                   

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            )}

            <div className="p-4 mt-10 mb-5 bg-white shadow-2xl rounded-lg flex justify-center items-center gap-4 fixed bottom-4">

                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNumber(1);
                    }}
                    className="w-[150px] h-[40px] bg-white text-black border border-gray-300 rounded-lg px-2"
                >
                    <option value={2}>2 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>

                <button
                    disabled={pageNumber === 1}
                    onClick={() => {
                        setPageNumber((previousPage) => previousPage - 1);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <span className="font-medium">
                    Page {pageNumber} of {totalPages}
                </span>

                <button
                    disabled={pageNumber >= totalPages}
                    onClick={() => {
                        setPageNumber((previousPage) => previousPage + 1);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>

            </div>

        </div>
    );
}