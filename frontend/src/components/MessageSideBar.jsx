import { getAllUsersForMessage } from "@/redux/slices/messageSlice";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { setSelectedUser } from "@/redux/slices/messageSlice";
import ProfileImage from "./ProfileImage";
import { ArrowLeft, ArrowRight } from "lucide-react";

const UserListItem = React.memo(function UserListItem({
    user,
    collapsed,
    isActive,
    onSelect,
}) {
    return (
        <button
            onClick={() => onSelect(user)}
            className={`flex items-center rounded-lg
            ${collapsed ? "justify-center p-1 w-12 h-12" : "gap-3 px-3 w-full h-12"}
            ${isActive ? "bg-purple-600 text-white" : "text-white/80 hover:bg-gray-800 hover:text-white"}
            transition-colors duration-100 ease-linear
            focus-visible:outline-none focus-visible:ring-0 touch-manipulation`}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            <ProfileImage
                user={user}
                className={collapsed ? "w-8 h-8" : "w-10 h-10"}
            />

            {!collapsed && (
                <p className="text-white text-sm font-semibold truncate">
                    {user?.username}
                </p>
            )}
        </button>
    );
});

function MessageSideBar() {
    const dispatch = useDispatch();
    const { users, selectedUser } = useSelector((state) => state.messages);
    const { user: currentUser, onlineUsers } = useSelector((state) => state.user);

    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const selectedUserId = selectedUser?._id;

    const [showOnlineUsers, setShowOnlineUsers] = useState(false);

    const filteredUsers = showOnlineUsers
        ? users.filter((user) => onlineUsers.includes(user?._id))
        : users;

    useEffect(() => {
        dispatch(getAllUsersForMessage());
    }, [dispatch]);

    const handleToggleSidebar = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    const handleUserSelect = useCallback(
        (user) => {
            dispatch(setSelectedUser(user));

            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        },
        [dispatch],
    );

    // jab window ka size chota ho to side baar
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setCollapsed(mobile);
        };

        handleResize(); // initial check

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <aside
                className={`fixed md:sticky top-0 left-0 h-screen z-50 p-3 sm:p-4 flex flex-col 
            bg-linear-to-b from-[#0f0f0f] to-[#0a0a0a] text-white 
            shadow-2xl border-r border-white/10
            overflow-hidden transition-transform duration-300
            ${isMobile
                        ? `${collapsed ? "-translate-x-full" : "translate-x-0"} w-60 sm:w-64`
                        : `${collapsed ? "w-16 sm:w-20" : "w-60 sm:w-64"} translate-x-0`
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Top Section */}
                    <div>
                        <NavLink
                            to="/"
                            className={`flex justify-center items-center w-full 
            ${collapsed ? "p-1" : "p-2 sm:p-3"}`}
                        >
                            <img
                                src="https://res.cloudinary.com/dthsimdfz/image/upload/v1775485285/finalPNGSeemedia_atidsc.webp"
                                alt="logo"
                                className={`hidden md:block 
                                ${collapsed ? "h-10 w-10" : "h-auto w-auto"} 
                                object-contain mx-auto`}
                            />

                            <img
                                src="https://res.cloudinary.com/dthsimdfz/image/upload/v1775485285/finalPNGSeemedia_atidsc.webp"
                                alt="logo"
                                className="block md:hidden w-9 h-9 object-contain mx-auto"
                            />
                        </NavLink>
                    </div>

                    {/* Title */}
                    {showOnlineUsers !== undefined && (
                        <div className="relative mt-3 flex items-center gap-2 px-2">

                            <label className="cursor-pointer flex items-center gap-2 text-white/80 hover:text-white transition-colors">

                                <input
                                    type="checkbox"
                                    checked={showOnlineUsers}
                                    onChange={(e) => setShowOnlineUsers(e.target.checked)}
                                    className="w-4 h-4 rounded border border-white/20 bg-zinc-800 checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-0 cursor-pointer transition"
                                />

                            </label>
                            {/* expanded sidebar text */}
                            {!collapsed && (
                                <span className="text-sm font-medium whitespace-nowrap">
                                    Show Online Users
                                </span>
                            )}
                            {/* collapsed sidebar text */}
                            {collapsed && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow">
                                    {onlineUsers?.length - 1}
                                </span>
                            )}
                            {/* expanded sidebar online users count */}
                            {!collapsed && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow mt-1">
                                    { onlineUsers?.length>0 ?  onlineUsers?.length - 1 : 0 } Online
                                </span>
                            )}

                        </div>
                    )}

                    {filteredUsers?.length === 0 && <div className="flex justify-center items-center h-screen">
                        <p className="text-sm text-zinc-500 ">No online users</p>
                    </div>
                    }

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto overscroll-y-contain no-scrollbar mt-4 sm:mt-5 pr-1">
                        <nav className="flex flex-col gap-1.5 sm:gap-2">
                            {filteredUsers?.map((user, i) => {
                                const isActive = selectedUserId === user?._id;

                                return (
                                    <UserListItem
                                        key={user?._id || i}
                                        user={user}
                                        collapsed={collapsed}
                                        isActive={isActive}
                                        onSelect={handleUserSelect}
                                    />
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-3 sm:mt-4 pt-2 border-t border-white/5">
                        {currentUser && (
                            <div
                                className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
                            >
                                <div
                                    className={`relative flex items-center gap-3 ${collapsed ? "w-12" : "w-full"}`}
                                >
                                    <Link
                                        to={`/profile/${currentUser?._id}`}
                                        className={`flex items-center 
                    ${collapsed ? "justify-center p-2" : "gap-3 p-2 w-full"} 
                    rounded-xl cursor-pointer 
                    transition-colors duration-75 
                    hover:bg-white/10`}
                                        style={{ WebkitTapHighlightColor: "transparent" }}
                                    >
                                        <ProfileImage
                                            user={currentUser}
                                            className={collapsed ? "w-8 h-8" : "w-10 h-10"}
                                        />

                                        {!collapsed && (
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-semibold text-sm">
                                                    {currentUser?.username}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    View Profile
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Collapse Button */}
            <button
                className={`fixed top-4 z-60
      bg-black/70 backdrop-blur-md 
      hover:bg-black/90 
      text-white p-2 rounded-full shadow-lg
      border border-white/10
      transition-none
      ${isMobile
                        ? "left-3 translate-x-0"
                        : `${collapsed ? "left-16 sm:left-20" : "left-60 sm:left-64"} -translate-x-1/2`
                    }`}
                onClick={handleToggleSidebar}
                style={{ WebkitTapHighlightColor: "transparent" }}
            >
                {collapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>
        </>
    );
}

export default MessageSideBar;
