import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import ProfileImage from "./ProfileImage";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./Spinner";
import { fetchSuggestedUsers } from "@/redux/slices/userSlice";

function SuggestedUsers({ showAllPage = false, limit = 8 }) {

    const {
        user: currentUser,
        suggestedUsers,
        suggestedUsersError,
        suggestedUsersLoading,
    } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSuggestedUsers(showAllPage ? { all: true } : { limit }));
    }, [dispatch, showAllPage, limit]);

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

    if (showAllPage) {
        return (
            <div className="w-full">
                <div className="mb-6 rounded-2xl border border-white/10 bg-linear-to-r from-white/10 to-white/5 p-5 backdrop-blur-sm">
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">Discover People</h2>
                    <p className="mt-1 text-sm text-gray-300 sm:text-base">
                        Explore and follow creators you may like.
                    </p>
                    <p className="mt-3 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                        {visibleSuggestedUsers.length} users available
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleSuggestedUsers.map((user) => (
                        <div
                            key={user?._id}
                            className="rounded-2xl border border-white/10 bg-linear-to-br from-zinc-900/80 to-zinc-800/70 p-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30"
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <Link to={`/profile/${user?._id}`} className="inline-flex min-w-0">
                                        <ProfileImage user={user} username className="w-12 h-12" />
                                    </Link>
                                    <p className="mt-2 text-xs text-gray-400">Suggested for you</p>
                                </div>

                                <Link
                                    to={`/profile/${user?._id}`}
                                    className="shrink-0 rounded-md border border-white/15 px-2 py-1 text-xs text-gray-200 transition hover:border-white/30 hover:bg-white/10"
                                >
                                    View
                                </Link>
                            </div>

                            <div className="mt-4">
                                <FollowButton
                                    targetUserId={user?._id}
                                    currentUser={currentUser}
                                    className="w-full justify-center"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="hidden w-full flex-col gap-5 lg:flex">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-wide text-white">Suggested for you</h2>

                <Link
                    to="/suggested-users"
                    className="text-sm text-indigo-400 transition hover:text-indigo-300"
                >
                    See All →
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {visibleSuggestedUsers.map((user) => (
                    <div
                        key={user?._id}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:shadow-black/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <ProfileImage user={user} username />

                                <span className="ml-10 text-xs text-gray-400">Suggested for you</span>
                            </div>
                        </div>

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
