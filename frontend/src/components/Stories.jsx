import { axiosInstance } from "@/lib/axios";
import {
  Play, Plus, Pause, Volume2, VolumeX,
  Eye, ArrowLeft, ArrowRight, Heart, MessageCircle, Send, X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultprofile from "../assets/defaultProfile.jpg";
import CreateMedia from "./CreateMedia";
import Modal from "./Modal";
import { getAllStories } from "../redux/slices/storiesSlice";
import ProfileImage from "./ProfileImage";
import CommentSection from "./CommentSection";
import { timeAgo } from "@/lib/timeAgo";
import LikeButton from "./LikeButton";


function Stories() {

  const { user: currentUser } = useSelector((state) => state.user);
  const { stories = [] } = useSelector((state) => state.stories);


  const dispatch = useDispatch();

  // const [stories, setStories] = useState([]);
  const viewedStoriesRef = useRef(new Set());
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isCreateStoryModal, setIsCreateStoryModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showStoryViewModal, setShowStoryViewModal] = useState(false);


  const videoRef = useRef(null);
  const progressIntervalref = useRef(null);
  const commentsModalref = useRef(null);
  const lastNextAtRef = useRef(0);
  const activeStoryIdRef = useRef(null);
  const wasStoryModalOpenRef = useRef(false);

  const handleNextStoryRef = useRef(null);

  const currentUserStories = stories?.[currentUserIndex]?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  const currentStoryUser = stories?.[currentUserIndex]?.user;

  const [likeCount, setLikeCount] = useState(currentStory?.likes?.length || 0);


  useEffect(() => {
    activeStoryIdRef.current = currentStory?._id || null;
  }, [currentStory?._id, showStoryModal]);

  const isLastStoryOfLastUser =
    currentUserIndex === stories?.length - 1 &&
    currentStoryIndex === currentUserStories?.length - 1;

  const canGoPrevious = currentUserIndex > 0 || currentStoryIndex > 0;
  const canGoNext = !isLastStoryOfLastUser;

  const pauseBackgroundVideos = useCallback(() => {
    const storyVideo = videoRef.current;
    const allVideos = document.querySelectorAll("video");

    allVideos.forEach((videoEl) => {
      if (videoEl !== storyVideo) {
        videoEl.pause();
      }
    });
  }, []);


  const handleNextStory = useCallback(() => {
    if (!showStoryModal) return;

    const now = Date.now();
    if (now - lastNextAtRef.current < 350) return;
    lastNextAtRef.current = now;

    if (progressIntervalref.current) {
      clearInterval(progressIntervalref.current);
      progressIntervalref.current = null;
    }

    const userStories = stories?.[currentUserIndex]?.stories || [];

    if (isLastStoryOfLastUser) {
      setTimeout(() => setShowStoryModal(false), 300);
      return;
    }

    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    }

    setProgress(0);
    setIsPlaying(true);
  }, [currentStoryIndex, currentUserIndex, stories, isLastStoryOfLastUser, showStoryModal]);

  useEffect(() => {
    handleNextStoryRef.current = handleNextStory;
  }, [handleNextStory]);

  const handlePreviousStory = () => {
    if (progressIntervalref.current) {
      clearInterval(progressIntervalref.current);
      progressIntervalref.current = null;
    }
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      const prevUserStories = stories[currentUserIndex - 1]?.stories || [];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(prevUserStories.length - 1);
    }
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (currentStory?.mediaType === "video") {
      const video = videoRef.current;
      if (!video) return;
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleMediaVolume = (e) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) videoRef.current.muted = newMutedState;
  };

  const handleUserClick = (index) => {
    window.dispatchEvent(new CustomEvent("seemedia:pause-all-videos"));
    pauseBackgroundVideos();
    setCurrentUserIndex(index);
    setIsMuted(true);
    setShowStoryModal(true);
    setCurrentStoryIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleCreateStoryModel = () => {setIsCreateStoryModal(true);
     (true)
}
  // const getAllstories = async () => {
  //   try {
  //     const { data } = await axiosInstance.get("/stories/all");
  //     setStories(data?.stories);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  // const addCommentToStory = async (storyId) => {

  // };

  useEffect(() => {
    dispatch(getAllStories())
  }, [dispatch]);

  useEffect(() => {
    if (!showStoryModal || !currentStory) return;
    if (currentStory?.mediaType === "video") {
      const video = videoRef.current;
      if (video) {
        video.muted = isMuted;
        if (isPlaying) {
          video.play().catch(() => setIsPlaying(false));
        } else {
          video.pause();
        }
      }
    }
  }, [currentStory, showStoryModal, isMuted, isPlaying]);

  useEffect(() => {
    if (!showStoryModal) return;

    window.dispatchEvent(new CustomEvent("seemedia:pause-all-videos"));
    pauseBackgroundVideos();

    if (currentStory?.mediaType !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    const rafId = requestAnimationFrame(() => {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    });

    return () => cancelAnimationFrame(rafId);
  }, [showStoryModal, currentStory?._id, currentStory?.mediaType, isMuted, pauseBackgroundVideos]);

  useEffect(() => {
    if (wasStoryModalOpenRef.current && !showStoryModal) {
      window.dispatchEvent(new CustomEvent("seemedia:resume-feed-videos"));
      const resumeTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("seemedia:resume-feed-videos"));
      }, 340);

      return () => clearTimeout(resumeTimeout);
    }

    wasStoryModalOpenRef.current = showStoryModal;
  }, [showStoryModal]);


  useEffect(() => {
    // Pehle hamesha clear karo
    if (progressIntervalref.current) {
      clearInterval(progressIntervalref.current);
      progressIntervalref.current = null;
    }

    if (!isPlaying || !showStoryModal || !currentStory) return;

    const startInterval = (duration) => {
      const storyIdAtStart = currentStory?._id;

      if (!duration || duration <= 0 || isNaN(duration)) return;


      const interval = 100;
      const step = (interval / duration) * 100;
      progressIntervalref.current = setInterval(() => {
        if (!showStoryModal || activeStoryIdRef.current !== storyIdAtStart) {
          clearInterval(progressIntervalref.current);
          progressIntervalref.current = null;
          return;
        }

        setProgress((prev) => {
          const nextValue = prev + step;
          if (nextValue >= 100) {
            clearInterval(progressIntervalref.current);
            progressIntervalref.current = null;

            handleNextStoryRef.current?.();
            return 100;
          }
          return nextValue;
        });
      }, interval);
    };

    if (currentStory?.mediaType !== "video") {
      startInterval(5000);
    }

    return () => {
      clearInterval(progressIntervalref.current);
      progressIntervalref.current = null;
    };

  }, [currentStoryIndex, currentUserIndex, isPlaying, showStoryModal, currentStory]);

  useEffect(() => {
    if (!showStoryModal || !currentStory || currentStory?.mediaType !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    const updateProgressFromVideo = () => {
      const duration = video.duration;
      if (!duration || !Number.isFinite(duration)) return;
      const value = (video.currentTime / duration) * 100;
      setProgress(Math.min(Math.max(value, 0), 100));
    };

    video.addEventListener("loadedmetadata", updateProgressFromVideo);
    video.addEventListener("durationchange", updateProgressFromVideo);
    video.addEventListener("timeupdate", updateProgressFromVideo);

    updateProgressFromVideo();

    return () => {
      video.removeEventListener("loadedmetadata", updateProgressFromVideo);
      video.removeEventListener("durationchange", updateProgressFromVideo);
      video.removeEventListener("timeupdate", updateProgressFromVideo);
    };
  }, [currentStory, showStoryModal]);

  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentUserIndex]);


  const handleStoryView = async (storyId) => {
    if (!storyId) return;
    if (viewedStoriesRef.current.has(storyId)) return; // ✅ Baar baar nahi chalega
    viewedStoriesRef.current.add(storyId);

    try {
      await axiosInstance.put(`/stories/${storyId}/view`)
    }
    catch (error) {
      console.log("Error viewing story:", error)
    }
  }


  const handleOpenCommentsModal = () => {
    setShowCommentsModal(true);
    setIsPlaying(false);

    // clear progress interval for image
    if (progressIntervalref.current) {
      clearInterval(progressIntervalref.current);
      progressIntervalref.current = null;
    }
  }

  const handleCloseCommentsModal = () => {
    setShowCommentsModal(false);
    if (showStoryModal && !showStoryViewModal) {
      setIsPlaying(true);
    }
  }

  const addCommentToStory = async (storyId) => {
    try {
      if (!newComment.trim()) return;


      console.log(newComment);



      const { data } = await axiosInstance.post(`/stories/${storyId}/comment`, { text: newComment })
      setNewComment("");

      if (data?.success) {
        dispatch(getAllStories());
      }
    }
    catch (error) {
      console.log("Error adding comment on story:", error)
    }
  }

  // to stop video when comment or view modal is open
  useEffect(() => {
    const video = videoRef.current;

    if (showCommentsModal || showStoryViewModal) {
      if (video) video.pause();
      setIsPlaying(false);
      if (progressIntervalref.current) {
        clearInterval(progressIntervalref.current);
        progressIntervalref.current = null;
      }
    } else if (showStoryModal) { // Sirf tab resume karo jab story modal open ho
      if (currentStory?.mediaType === "video" && video) {
        video.play().catch(() => { });
      }
      setIsPlaying(true);
    }
  }, [showCommentsModal, showStoryViewModal]);


  // jab story modal bnd ho to view and commentmodal bhi bnd ho
  useEffect(() => {

    if (!showStoryModal) {
      if (showCommentsModal) setShowCommentsModal(false);
      if (showStoryViewModal) setShowStoryViewModal(false);
    }

  }, [showStoryModal, showCommentsModal, showStoryViewModal])

  // to sync likes count
  useEffect(() => {
    setLikeCount(currentStory?.likes?.length || 0);
  }, [currentStory]);


  return (
    <div className="flex items-center overflow-x-auto p-2 space-x-4 no-scrollbar">
      {/* Create Story Button */}
      <div
        onClick={handleCreateStoryModel}
        className="shrink-0 flex flex-col items-center cursor-pointer"
      >
        <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-pink-500 shadow-lg">
          { currentUser && (currentUser?.profileImage || `https://res.cloudinary.com/dthsimdfz/image/upload/v1776102781/defaultProfile_x5ldcq.jpg`) ? (
            <img
              className="w-full h-full rounded-full object-cover"
              src={currentUser?.profileImage || `https://res.cloudinary.com/dthsimdfz/image/upload/v1776102781/defaultProfile_x5ldcq.jpg`}
              alt="profile"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-800">
              <Plus size={18} className="text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 mr-1 mb-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10">
            <Plus size={14} className="w-5 h-5 text-gray-800" />
          </div>
        </div>
        <span className="text-xs mt-2 truncate w-20 text-center text-gray-400">Create Story</span>
      </div>

      {/* Stories List */}
      <div className="flex space-x-4 py-4 overflow-auto no-scrollbar">
        {stories?.map((userStories, index) => (
          <div
            key={userStories?.user?._id}
            onClick={() => handleUserClick(index)}
            className="flex flex-col items-center cursor-pointer shrink-0"
          >
            <div className={`p-0.5 rounded-full mb-2 transition-all duration-200 ${index === currentUserIndex ? "ring-2 ring-blue-500 ring-offset-2 scale-105" : "hover:scale-105"}`}>


              <img
                src={userStories?.user?.profileImage || defaultprofile}
                alt={userStories?.user?.name}
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
              />
            </div>
            <span className="text-xs truncate w-20 text-center text-gray-400">
              {userStories?.user?._id === currentUser?._id ? "Your Story" : userStories?.user?.username}
            </span>
          </div>
        ))}
      </div>

      {/* Create Story Modal */}
      <Modal openModal={isCreateStoryModal} initialWidth="max-w-2xl " initialHeight="h-auto" onClose={() => setIsCreateStoryModal(false)} >
        <div className="w-full max-w-2xl">

          <CreateMedia
            type="story"
            onSuccess={() => {
              setIsCreateStoryModal(false);
              dispatch(getAllStories());
            }}
          />
        </div>
      </Modal>

      {/* Story Viewer Modal */}
      <Modal
        openModal={showStoryModal}
        onClose={() => {setShowStoryModal(false)
          ;}
        }
        className="sm:max-w-lg p-0 overflow-visible "
      >
        <div className="w-full max-w-lg relative h-150 bg-black rounded-xl overflow-hidden">
          {/* Media Content */}
          <div className="absolute inset-0 z-0">
            {currentStory?.mediaType === "image" ? (
              <img
                src={currentStory?.mediaUrl}
                onLoad={() => handleStoryView(currentStory?._id)}
                alt="story"
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <video
                key={currentStory?._id}
                ref={videoRef}
                src={currentStory?.mediaUrl}
                autoPlay
                playsInline
                muted={isMuted}
                onLoadedData={() => handleStoryView(currentStory?._id)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  const video = videoRef.current;
                  const validDuration = Number.isFinite(video?.duration) && video.duration > 0;
                  if (!validDuration) return;

                  if (progressIntervalref.current) {
                    clearInterval(progressIntervalref.current);
                    progressIntervalref.current = null;
                  }
                  handleNextStoryRef.current?.();
                }}
                className="w-full h-full object-contain bg-black"
              />
            )}
          </div>

          {/* linears */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-linear-to-b from-black/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black/60 to-transparent z-10 pointer-events-none" />

          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-3">
            {currentUserStories?.map((story, index) => (
              <div key={story?._id} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-0 right-0 z-30 flex justify-between items-center px-3">
            <div className="flex items-center gap-2">

             
                {/* ProfileImage with username */}
                <div className="flex flex-col">

                  <ProfileImage user={currentStoryUser} username />

                  
                  <span className="text-white/60 text-[11px] ml-13 -mt-1">
                    {timeAgo(new Date(currentStory?.createdAt))}
                  </span>

                </div>

    

            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePlayPause} className="text-white w-8 h-8 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 transition-all">
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              {currentStory?.mediaType === "video" && (
                <button onClick={handleMediaVolume} className="text-white w-8 h-8 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 transition-all">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              )}

              {/* Viewer Button */}

              {currentStoryUser?._id === currentUser?._id && (
                <button onClick={() => setShowStoryViewModal(true)} className="text-white w-8 h-8 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 transition-all">
                  <Eye size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Caption */}
          {currentStory?.caption && (
            <div className="absolute bottom-16 left-3 right-3 z-20">
              <p className="text-white text-center text-[13px] leading-relaxed bg-black/50 rounded-xl px-4 py-2 backdrop-blur-sm">
                {currentStory?.caption}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex justify-between items-center z-10 pointer-events-none">
            <button
              onClick={handlePreviousStory}
              className={`w-1/2 h-full flex items-center justify-start pointer-events-auto transition-opacity px-3 ${canGoPrevious ? "opacity-0 hover:opacity-100" : "opacity-0 cursor-default"}`}
              disabled={!canGoPrevious}
            >
              <div className="bg-black/50 rounded-full p-2"><ArrowLeft size={16} className="text-white" /></div>
            </button>
            <button
              onClick={handleNextStory}
              className={`w-1/2 h-full flex items-center justify-end pointer-events-auto transition-opacity px-3 ${canGoNext ? "opacity-0 hover:opacity-100" : "opacity-0 cursor-default"}`}
              disabled={!canGoNext}
            >
              <div className="bg-black/50 rounded-full p-2"><ArrowRight size={16} className="text-white" /></div>
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center gap-2 px-3 pb-4 pt-2 bg-linear-to-t from-black/40 to-transparent">

            {/* story LIke Button */}
            <div className="relative flex flex-col items-center">
              <LikeButton type="stories" item={currentStory} size={20}
              />
              {likeCount > 0 && <span className="absolute -top-1 -right-1.5 text-[9px] text-white font-semibold bg-red-500 rounded-full min-w-4 h-4 flex items-center justify-center px-1">{likeCount}</span>}
              <span className="text-[9px] text-white/70 mt-0.5">Like</span>
            </div>

            {/* see Comment on story button */}
            <button onClick={handleOpenCommentsModal} className="relative flex flex-col items-center">
              <MessageCircle size={20} className="text-white" />
              {currentStory?.comments?.length > 0 && <span className="absolute -top-1 -right-1.5 text-[9px] text-white font-semibold bg-red-500 rounded-full min-w-4 h-4 flex items-center justify-center px-2">
                {currentStory?.comments?.length}
              </span>}
              <span className="text-[9px] text-white/70 mt-0.5">Comment</span>
            </button>

            {/* reply input */}
            <div className="flex-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Reply..."
                  className="w-full px-3 py-1.5 pr-9 rounded-full bg-white/20 text-white placeholder:text-white/50 focus:outline-none border border-white/30 text-xs"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addCommentToStory(currentStory?._id);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white hover:text-gray-500 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Modal */}
          {showCommentsModal && (
            <div
              className="fixed inset-0 z-50 w-full flex items-end justify-center bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseCommentsModal();
                }
              }}
            >

              <div
                ref={commentsModalref}
                className="bg-gray-850/50 rounded-t-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    Comments ({currentStory?.comments?.length || 0})
                  </h3>
                  <button
                    onClick={handleCloseCommentsModal}
                    className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar ">

                  <CommentSection comments={currentStory?.comments} />

                </div>

                <div className="p-4 border-t border-gray-200 border-black/50">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Reply..."
                      className="w-full px-3 py-1.5 pr-9 rounded-full bg-white/20 text-white placeholder:text-white/50 focus:outline-none border border-white/30 text-xs"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addCommentToStory(currentStory?._id);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white hover:text-gray-500 transition-colors"

                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>



              </div>
            </div>
          )}

          {/* viewers Modal */}
          {showStoryViewModal && currentStory && (
            <div
              className="fixed inset-0 z-50 w-full flex items-end justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowStoryViewModal(false)}
            >
              <div

                className="bg-gray-850/50 rounded-t-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    Viewers ({currentStory?.viewers?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowStoryViewModal(false)}
                    className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Viewer List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar ">
                  {currentStory?.viewers?.map(u => <ProfileImage key={u?._id} user={u} username />)}

                </div>




              </div>
            </div>
          )}

        </div>
      </Modal>
    </div>
  );
}

export default Stories;