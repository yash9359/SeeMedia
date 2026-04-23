// import { axiosInstance } from "@/lib/axios";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FollowButton from "./FollowButton";
import ProfileImage from "./ProfileImage";
import { useSelector,useDispatch } from "react-redux";
import Spinner from "./Spinner";
import { fetchSuggestedUsers } from "@/redux/slices/userSlice";

function SuggestedUsers() {

    // direct redux se looo  waha thunk se call ho jayega
    const {
        user: currentUser,
        suggestedUsers,
        suggestedUsersError,
        suggestedUsersLoading,
    } = useSelector((state) => state.user);
    const dispatch =useDispatch()

    // const fetchSuggestedUsers = async () => {
    //     try {
    //         setLoading(true);
    //         const { data } = await axiosInstance.get("/users/suggested/users");
    //         if (data?.success) {
    //             setSuggestedUsers(data?.users);
    //         } else {
    //             setError(data.message || "Failed to fetch suggested users");
    //         }
    //     } catch (error) {
    //         console.log("Error :", error);
    //         setError(error.message || "Failed to fetch suggested users");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {

        
        dispatch(fetchSuggestedUsers());
    
      
        
    }, [dispatch]);

    const location = useLocation();
    const path = location.pathname.startsWith("/suggested-users");
    const visibleSuggestedUsers = suggestedUsers.filter(
        (user) => user?._id?.toString() !== currentUser?._id?.toString(),
    );

    if (suggestedUsersLoading) {
        return <Spinner/>
    }
    if (suggestedUsersError) return <p className="text-red-500 ">{suggestedUsersError}</p>;
    if (visibleSuggestedUsers.length === 0) {
        return <p className="text-gray-400">No suggested users found</p>;
    }
    return (


       
        
             <div
            className={`flex-col hidden lg:flex gap-5 w-full ${path ? "w-full max-w-xl mt-8 " : ""
                }`}
        >
            {/* Header */}
            <div
                className={`flex items-center ${path ? "justify-center gap-3 text-lg" : "justify-between"
                    }`}
            >
                <h2 className="text-white text-lg font-semibold tracking-wide">
                    Suggested for you
                </h2>

                {!path && (
                    <Link
                        to="/suggested-users"
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                    >
                        See All →
                    </Link>
                )}
            </div>

            {/* Users List */}
            <div className="flex flex-col gap-3">
                {visibleSuggestedUsers.map((user) => (
                    <div
                        key={user?._id}
                        className="group flex items-center justify-between gap-4 
                        px-4 py-3 rounded-xl 
                        bg-white/5 backdrop-blur-lg border border-white/10 
                        hover:bg-white/10 hover:shadow-md hover:shadow-black/30 
                        transition-all duration-300"
                    >
                        {/* Left: User Info*/}
                        <div className="flex items-center gap-3">

                            <div className="flex flex-col ">

                                <ProfileImage user={user} username />

                                <span className="text-xs ml-10 text-gray-400">
                                    Suggested for you
                                </span>
                            </div>
                        </div>

                        {/* right follow button */}
                        <FollowButton
                            targetUserId={user?._id}
                            currentUser={currentUser}
                        />
                    </div>
                ))}
            </div>
        </div>

      
       
    );
}

export default SuggestedUsers;
