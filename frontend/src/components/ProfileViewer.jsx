import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import { ArrowBigLeft, ArrowLeft, ArrowRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import FollowButton from "./FollowButton";
import CommentSection from "./CommentSection";
import MediaIcons from "./MediaIcons";
import CommentForm from "./CommentForm";
import { useSelector } from "react-redux";

function ProfileViewer({
    content,
    handleModalVideoClick,
    handleModalMuteToggle,
    modalVideoRef,
    showIcon,
    isMuted,
    isPlaying,
    startIndex = 0,
    activeTab,
    currentUser,
    type,
}) {




    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [comments, setComments] = useState([]);
    const [currentPost, setCurrentPost] = useState(content?.[currentIndex] || null)


    useEffect(() => {
        setCurrentPost(content?.[currentIndex] || null)
    }, [content, currentIndex]);

    useEffect(() => {
        setComments(currentPost?.comments || [])

    }, [currentPost]);

    const prev = () => setCurrentIndex(i => i === 0 ? content?.length - 1 : i - 1)
    const next = () => setCurrentIndex(i => i === content?.length - 1 ? 0 : i + 1)

    if (!currentPost) return null;

    return (
        <div className="flex w-full h-full border-white/70 border rounded-xl overflow-hidden relative">
            {/*Media*/}

            {/* Left Media section */}
            <div className=" shrink-0   w-1/2 h-full bg-black flex items-center justify-center relative">

                {currentPost?.mediaType === "image" ? (
                    <img
                        src={currentPost?.mediaUrl}
                        alt={currentPost?.caption}
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <>
                        <video
                            ref={modalVideoRef}
                            src={currentPost?.mediaUrl}
                            loop
                            autoPlay
                            playsInline
                            muted={isMuted}
                            onClick={handleModalVideoClick}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Play/Pause Icon */}
                        {showIcon && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/50 p-3 rounded-full">
                                    {isPlaying ? (
                                        <Pause size={28} className="text-white" />
                                    ) : (
                                        <Play size={28} className="text-white" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mute Button */}
                        <button
                            onClick={handleModalMuteToggle}
                            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full"
                        >
                            {isMuted ? (
                                <VolumeX size={18} className="text-white/70" />
                            ) : (
                                <Volume2 size={18} className="text-white" />
                            )}
                        </button>
                    </>
                )}
            </div>

            {/* RightSection -Comments */}
            <div className="flex flex-col  w-1/2 border-l border-gray-800  bg-black/50 ">
                {/* User Header Section */}
                <div className="flex w-full  px-3 py-2 gap-3 top-0 border-b sticky border-gray-800 z-10">
                    {/* currentPost ki profile image */}
                    {currentPost?.user && <ProfileImage user={currentPost?.user} username />}

                    <div>
                        <FollowButton
                            targetUserId={currentPost?.user?._id}
                            currentUser={currentUser}
                            type={type}
                        />
                    </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto no-scrollbar mt-4">
                    <CommentSection comments={comments} />
                </div>

                {/* Fixed Bottom Section  */}
                <div className="w-full border border-gray-800 sticky bottom-0 right-0 overflow-y-auto no-scrollbar">
                    <MediaIcons item={ currentPost } type={type} size={24}
                        onToggle={(updateItem) => setCurrentPost(updateItem)} shareIcon />

                    {/* Likes count */}
                    {currentPost?.likes?.length > 0 && (
                        <div className="px-3">
                            <button className="font-semibold text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                                {currentPost.likes.length}{" "}
                                {currentPost.likes.length === 1 ? "like" : "likes"}
                            </button>
                        </div>
                    )}
                    {/* comment Input Form */}

                    <div className="p-3 border-t border-gray-800 no-scrollbar">
                        <CommentForm
                            item={currentPost}
                            type={type}
                            currentUser={currentUser}
                            setComments={setComments}
                        />
                    </div>
                </div>
            </div>

            {content?.length > 1 &&
                <>

                    <button onClick={prev} className="  absolute left-1 top-[45%] -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 text-white rounded-full ">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="absolute right-1 top-[45%] -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 text-white rounded-full ">
                        <ArrowRight className="w-5 h-5" />
                    </button>

                </>}


        </div>
    )
}

export default ProfileViewer;
