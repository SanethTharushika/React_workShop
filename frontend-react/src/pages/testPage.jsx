import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaDocker } from "react-icons/fa";
import uploadMedia from '../utils/mediaUpload';



export default function TestPage() {

    const [file, setFile] = useState(null);

    async function uploadFile() {

        const respose = await uploadMedia(file)
        console.log(respose);
    }


    return (
        <div className="w-min-full min-h-screen bg-white flex justify-center items-center">
            <input type="file" onChange={
                (e) => {
                    setFile(e.target.files[0]);
                }
            } />
            <button
                className="w-24 h-12 bg-blue-500 text-white rounded-lg mx-5" onClick={uploadFile}>
                upload
            </button>
        </div>
    )
}







































// export default function TestPage() {

//     const [score, setScore] = useState(50);
//     const [isFollewd, setIsFollowed] = useState(false);

//     // let score = 50;

//     return (
//         <div className="w-min-full min-h-screen bg-green-500 flex justify-center items-center">
//             <div className="w-[450px] h-[450px] bg-white flex flex-col justify-center items-center">
//                 <h1 className="text-5xl font-bold">{score}</h1>
//                 <div className="w-full h-[100px] flex justify-center items-center">
//                     <button className="w-[100px] h-[50px] bg-green-500 text-white rounded-lg mx-5"
//                         onClick={() => {
//                             setScore(score + 1);
//                             toast.success("Score incremented");
//                         }
//                         }>
//                         Increment
//                     </button>
//                     <button className="w-[100px] h-[50px] bg-red-500 text-white rounded-lg mx-5"
//                         onClick={() => {
//                             setScore(score - 1);
//                             toast.error("Score decremented");
//                         }
//                         }>
//                         Decrement
//                     </button>
//                 </div>
//                 <FaDocker onClick={
//                     () => {
//                         setIsFollowed(!isFollewd);
//                         toast.success( isFollewd ? "Unfollowed" : "Followed",{icon: <FaDocker className={isFollewd ? "text-[20px] text-gray-500" : "text-[20px] text-blue-500"} />});
//                     }
//                 } className={isFollewd ? "text-[100px] text-blue-500" : "text-[100px] text-gray-500"} />
//             </div>

//         </div>
//     )
// }