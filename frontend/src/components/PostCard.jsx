import React, { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import Media from "./Media";
import MediaIcons from "./MediaIcons";
import CommentForm from "./CommentForm";
import Modal from "./Modal";
import CommentSection from "./CommentSection";


function PostCard({ post, currentUser, isMuted, setIsMuted }) {

    // const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [comments, setComments] = useState(post?.comments);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalPlaying, setIsModalPlaying] = useState(false);
    const [isModalMuted, setIsModalMuted] = useState(true);

    const [localpost, setLocalPost] = useState(post);

    const videoRef = useRef();
    const modalVideoRef = useRef();
    const userInteracted = useRef(false);
    const isInViewRef = useRef(false);


   


    // sync with parent
    useEffect(() => {
        setLocalPost(post);
    }, [post]);

    // comments sync (logic same rakha hai)
    useEffect(() => {
        setComments(localpost?.comments || []);
    }, [localpost]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = isMuted;
        }
        localStorage.setItem("isMuted", isMuted);
    }, [isMuted]);
// intersection for auto play
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isInViewRef.current = entry.isIntersecting;

                if (userInteracted.current && entry.isIntersecting) return;

                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                    setIsPlaying(true);
                } else {
                    video.pause();
                    setIsPlaying(false);
                    userInteracted.current = false;
                }
            },
            { threshold: 0.6 },
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        userInteracted.current = true;

        if (isPlaying) video.pause();
        else video.play();

        setIsPlaying((isPlaying) => !isPlaying);
        setShowIcon(true);
        setTimeout(() => setShowIcon(false), 700);
    };

    const handleMuteToggle = () => {
        setIsMuted(prev => !prev);
    };

    const handleOpenModal = () => {
        window.dispatchEvent(new CustomEvent("seemedia:pause-all-videos"));
        setIsModalOpen(true);
        videoRef.current?.pause();
        setIsPlaying(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        videoRef.current?.play().catch(() => { });
        setIsPlaying(true);
    };

    const handleModalVideoClick = () => {
        const video = modalVideoRef.current;
        if (!video) return;

        if (isModalPlaying) video.pause();
        else video.play();

        setIsModalPlaying((isModalPlaying) => !isModalPlaying);
        setShowIcon(true);
        setTimeout(() => setShowIcon(false), 700);
    };

    const handleModalMuteToggle = () => {
        const video = modalVideoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsModalMuted(video.muted);
    };

    useEffect(() => {
        if (!isModalOpen) return;

        const video = modalVideoRef.current;
        if (!video) return;

        video.muted = isModalMuted;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { });
        }

        setIsModalPlaying(true);

        return () => {
            video.pause();
            setIsModalPlaying(false);
        };

    }, [isModalOpen, isModalMuted]);

    useEffect(() => {
        const isVideoMostlyVisible = (video) => {
            if (!video) return false;

            const rect = video.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const ratio = visibleHeight / Math.max(rect.height, 1);

            return visibleHeight > 0 && ratio >= 0.2;
        };

        const handlePauseAllVideos = () => {
            videoRef.current?.pause();
            modalVideoRef.current?.pause();
            setIsPlaying(false);
            setIsModalPlaying(false);
        };

        const handleResumeFeedVideos = () => {
            const video = videoRef.current;
            if (!video) return;
            if (!isInViewRef.current && !isVideoMostlyVisible(video)) return;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        };

        window.addEventListener("seemedia:pause-all-videos", handlePauseAllVideos);
        window.addEventListener("seemedia:resume-feed-videos", handleResumeFeedVideos);

        return () => {
            window.removeEventListener("seemedia:pause-all-videos", handlePauseAllVideos);
            window.removeEventListener("seemedia:resume-feed-videos", handleResumeFeedVideos);
        };
    }, []);

    return (
        <>
            <div
                className="my-6 rounded-2xl border border-white/10 
    bg-white/5 backdrop-blur-xl 
    shadow-lg shadow-black/40 
    max-w-[320px] w-full mx-auto 
    transition-all duration-300 hover:shadow-xl hover:shadow-black/60"
            >

                {/* Header */}
                <div className="flex items-center px-3 py-2 gap-2">
                    <ProfileImage user={localpost?.user} username />
                    <FollowButton
                        targetUserId={localpost?.user?._id}
                        currentUser={currentUser}
                    />
                </div>

                {/* Media */}
                <Media
                    media={localpost}
                    showIcon={showIcon}
                    isPlaying={isPlaying}
                    handleVideoClick={handleVideoClick}
                    videoRef={videoRef}
                    isMuted={isMuted}
                    handleMuteToggle={handleMuteToggle}
                    userInteracted={userInteracted}
                />

                {/* Icons */}
                <MediaIcons
                    type="posts"
                    item={localpost}
                    size={24}
                    handleOpenModal={handleOpenModal}
                    onToggle={(updatedPost) => {
                        setLocalPost(updatedPost);
                    }}
                />

                {/* Caption */}
                <div className="px-3 pb-2 text-sm">
                    {localpost?.likes?.length > 0 && (
                        <button className="font-semibold text-gray-300 hover:text-white transition">
                            {localpost?.likes?.length}{" "}
                            {localpost?.likes?.length === 1 ? "like" : "likes"}
                        </button>
                    )}

                    {localpost?.caption && (
                        <div className="mt-1">
                            <span className="font-semibold text-white mr-1">
                                {localpost?.user?.username}
                            </span>
                            <span className="text-gray-400">
                                {localpost?.caption}
                            </span>
                        </div>
                    )}
                </div>

                {/* Comments preview */}
                {comments?.length > 0 && (
                    <div className="px-3 pb-2 cursor-pointer">
                        <button
                            className="text-gray-500 hover:text-gray-300 text-sm transition"
                            onClick={handleOpenModal}
                        >
                            View all {comments?.length} comments
                        </button>
                    </div>
                )}

                {/* Comment form */}
                <div className="p-3 border-t border-white/10">
                    <CommentForm
                        item={localpost}
                        type="posts"
                        currentUser={currentUser}
                        setComments={setComments}
                    />
                </div>
            </div>

            {/* Comment Modal */}
            <Modal
                openModal={isModalOpen}
                onClose={handleCloseModal}
                initialHeight="h-[78vh]"
                initialWidth="max-w-5xl"
            >
                <div className="flex w-full h-full border-white/70 border rounded-xl overflow-hidden relative">


                    {/* Media */}
                    <div className="w-1/2 h-full bg-black flex items-center justify-center relative">
                        {localpost?.mediaType === "image" ? (
                            <img
                                src={localpost?.mediaUrl}
                                alt={localpost?.caption}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (

                            <div className="relative w-full h-full flex items-center justify-center">

                                <video
                                    ref={modalVideoRef}
                                    src={localpost?.mediaUrl}
                                    loop
                                    autoPlay
                                    playsInline
                                    muted={isModalMuted}
                                    onClick={handleModalVideoClick}
                                    className="max-w-full max-h-full object-contain"
                                />

                                {/* Play / Pause */}
                                {showIcon && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                        <div className="bg-black/50 p-3 rounded-full">
                                            {isModalPlaying ? (
                                                <Pause size={28} className="text-white" />
                                            ) : (
                                                <Play size={28} className="text-white" />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 🔊 Mute */}
                                <button
                                    onClick={handleModalMuteToggle}
                                    className="absolute top-3 right-3 z-20 bg-black/50 p-2 rounded-full"
                                >
                                    {isModalMuted ? (
                                        <VolumeX size={20} className="text-white" />
                                    ) : (
                                        <Volume2 size={20} className="text-white" />
                                    )}
                                </button>

                            </div>

                        )}
                    </div>

                    {/* Right */}
                    <div className="flex flex-col w-1/2 border-l border-white/10 bg-black/50">

                        {/* Header */}
                        <div className="flex px-3 py-2 gap-3 border-b border-white/10">
                            <ProfileImage user={localpost?.user} username />
                            <FollowButton
                                targetUserId={localpost?.user?._id}
                                currentUser={currentUser}
                                type="post"
                            />
                        </div>

                        {/* Comments */}
                        <div className="flex-1 overflow-y-auto px-2 py-2">
                            <CommentSection comments={comments} />
                        </div>

                        {/* Bottom */}
                        <div className="w-full border border-gray-800 sticky bottom-0 right-0 overflow-y-auto no-scrollbar">
                            <MediaIcons item={localpost} type="posts" size={24}
                                onToggle={(updateItem) => setLocalPost(updateItem)} shareIcon />

                            {/* Likes count */}
                            {localpost?.likes?.length > 0 && (
                                <div className="px-3">
                                    <button className="font-semibold text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                                        {localpost.likes.length}{" "}
                                        {localpost.likes.length === 1 ? "like" : "likes"}
                                    </button>
                                </div>
                            )}
                            {/* comment Input Form */}

                            <div className="p-3 border-t border-gray-800 no-scrollbar">
                                <CommentForm
                                    item={localpost}
                                    type="posts"
                                    currentUser={currentUser}
                                    setComments={setComments}
                                />
                            </div>
                        </div>
                        {/* <div className="border-t border-white/10">
        <MediaIcons
          item={localpost}
          type="posts"
          size={24}
          onToggle={(updatedPost) => {
            setLocalPost(updatedPost);
          }}
          
        />
        
        
        <div className="p-3">
          <CommentForm
            item={localpost}
            type="posts"
            currentUser={currentUser}
            setComments={setComments}
          />
        </div>
      </div> */}
                    </div>

                </div>
            </Modal>
        </>
    );
}

export default PostCard;