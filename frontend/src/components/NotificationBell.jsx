import { timeAgo } from "@/lib/timeAgo";
import { Bell, Check, Heart, UserPlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef(null);
    const { notification } = useSelector((state) => state.user);

    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutSide);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const getNotification = ({ type }) => {
        switch (type) {
            case "like":
                return <Heart size={15} className="text-rose-400" />;

            case "follow":
                return <UserPlus size={15} className="text-indigo-300" />;

            default:
                return <Bell size={15} className="text-cyan-300" />;
        }
    };

    const totalNotifications = notification?.length || 0;

    return (
        <div className="relative" ref={dropDownRef}>
            {/* Bell icon with badge */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl 
                border border-white/10 bg-white/5 text-gray-200 
                hover:bg-white/10 transition-all duration-200"
                aria-label="Open notifications"
            >
                <Bell size={20} strokeWidth={2} />
                {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-rose-500 text-white rounded-full 
                    flex items-center justify-center text-[10px] font-semibold">
                        {totalNotifications > 9 ? "9+" : totalNotifications}
                    </span>
                )}
            </button>

            {/* DropDown */}
            {isOpen && (
                <div className="absolute left-full ml-3 top-0 w-80 z-50 max-h-96 overflow-y-auto rounded-2xl 
                border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-100">Notifications</h3>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Check size={14} /> Latest
                        </span>
                    </div>

                    {totalNotifications === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                            No notifications yet
                        </div>
                    ) : (
                        notification.slice(0, 20).map((notify, idx) => (
                            <div
                                key={`${notify.type}-${notify.userId}-${notify.postId || notify.targetUserId || idx}-${notify.createdAt || idx}`}
                                className="p-3 border-b last:border-b-0 border-white/5 hover:bg-white/5 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        {getNotification(notify)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <Link
                                            to={`/profile/${notify.userId}`}
                                            className="text-sm text-gray-100 hover:text-indigo-300 line-clamp-2"
                                        >
                                            {notify?.message || "New activity"}
                                        </Link>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {timeAgo(notify.createdAt)}
                                        </p>
                                    </div>

                                    {!notify?.read && (
                                        <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
