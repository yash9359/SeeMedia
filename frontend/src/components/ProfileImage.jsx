import React from 'react'
import defaultprofile from "../assets/defaultProfile.jpg"
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProfileImage = ({ user, username = false, className, showUserNameOnly = false }) => {

    const { user: currentUser, onlineUsers } = useSelector(state => state.user)


    const isOnline = onlineUsers?.includes(user?._id?.toString());

    return (

        <div className="flex items-center gap-3">

            <div className={`${className ? className : "w-8 h-8"} relative`}>

                {/* Gradient border */}
               <div className="w-full h-full rounded-full border border-white/10 bg-zinc-900 shadow-[0_0_8px_rgba(255,255,255,0.05)]">

                    {/* Image container */}
                    <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                            src={user?.profileImage || defaultprofile}
                            alt="profileImage"
                            className="w-full h-full object-cover select-none"
                            draggable={false}
                        />
                    </div>

                </div>

                {/*  Online green Dot */}
                {isOnline && user?._id !== currentUser?._id && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black bg-green-500"></span>
                )}

            </div>

            {username && (
                <Link to={`/profile/${user._id}`} className="text-white text-sm font-semibold hover:text-blue-500">
                    {user?.username}
                </Link>
            )}

            {showUserNameOnly && (
                <p className="text-white text-sm font-semibold">
                    {user?.username}
                </p>
            )}

        </div>
    );
};

export default ProfileImage
