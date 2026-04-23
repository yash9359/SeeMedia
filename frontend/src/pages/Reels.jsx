import { getAllReels } from "@/redux/slices/reelSlice";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageCircle,
  Pause,
  Play,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import FollowButton from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import Modal from "@/components/Modal";
import CommentSection from "@/components/CommentSection";
import CommentForm from "@/components/CommentForm";

function Reels() {
  const { reels } = useSelector((state) => state.reels);
  const { user: currentUser } = useSelector((state) => state.user);
  console.log("reels", reels);

  const dispatch = useDispatch();

  const videoRefs = useRef([]);
  const [playingStates, setPlayingStates] = useState({});
  const [showIconsStates, setshowIconsSates] = useState({});
  const [allMuted, setAllMuted] = useState(true);

  // Modal
  const [selectedReel, setSelectedReel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReelComments, setSelectedReelComments] = useState([]);

  useEffect(() => {
    if (selectedReel) {
      setSelectedReelComments(selectedReel?.comments || []);
    }
  }, [selectedReel]);

  const handleVideoClick = (id) => {
    const video = videoRefs.current.find((v) => v.dataset.id === id);
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    setPlayingStates((prev) => ({ ...prev, [id]: !prev[id] }));
    setshowIconsSates((prev) => ({ ...prev, [id]: !prev[id] }));
    setTimeout(
      () => setshowIconsSates((prev) => ({ ...prev, [id]: false })),
      600,
    );
  };
  // global mute toggle
  const handleMuteToggle = () => {
    const newMutedState = !allMuted;
    videoRefs.current.forEach((video) => {
      if (video) video.muted = newMutedState;
    });
    setAllMuted(newMutedState);
  };

  const handleOpenComments = (reel) => {
    setSelectedReel(reel);
    setSelectedReelComments(reel?.comments || []);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReel(false);
    setSelectedReelComments(null);
    setIsModalOpen(false);
  };

  // intersection for auto play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const id = video.dataset.id;

          if (entry.isIntersecting) {
            video.play().catch(() => { });
            setPlayingStates((prev) => ({ ...prev, [id]: true }));
          } else {
            video.pause();
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
          }
        });
      },
      { threshold: 0.8 },
    );

    //  observe all videos
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels]);

  useEffect(() => {
    dispatch(getAllReels());
  }, [dispatch]);

  return (
    <div className="bg-linear-to-br from-black via-zinc-900 to-black text-white min-h-screen flex">
      {/* sidebar component */}
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
        {reels?.map((reel, index) => (
          <div
            key={reel?._id || index}
            className="relative w-full max-w-sm mx-auto h-screen snap-start flex justify-center items-center bg-black"
          >
            <div className="relative m-2 w-full h-full">
              <video
                ref={(el) => {
                  if (el) {
                    videoRefs.current[index] = el;
                  }
                }}
                data-id={reel?._id}
                loop
                muted={allMuted}
                autoPlay
                playsInline
                className="relative w-full h-full object-cover rounded-xl shadow-md"
                onClick={() => handleVideoClick(reel?._id)}
              >
                <source src={reel?.mediaUrl} type="video/mp4" />
              </video>

              {/* Play / Pause */}
              {showIconsStates[reel?._id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                  <button className="bg-black/50 backdrop-blur-sm p-4 rounded-full opacity-90">
                    {playingStates[reel?._id] ? (
                      <Pause size={30} className="text-white" />
                    ) : (
                      <Play size={30} className="text-white" />
                    )}
                  </button>
                </div>
              )}

              {/* Mute */}
              <button
                onClick={handleMuteToggle}
                className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm p-3 rounded-full hover:bg-black/70 transition"
              >
                {allMuted ? <VolumeX /> : <Volume2 />}
              </button>

              {/* Caption + user */}
              <div className="absolute bottom-10 left-4 max-w-sm text-white text-sm">
                <div className="relative w-full h-[95%] flex items-center gap-1">
                  <ProfileImage user={reel?.user} username />
                  <FollowButton
                    targetUserId={reel?.user?._id}
                    type="reel"
                    currentUser={currentUser}
                  />
                </div>

                {reel?.caption && (
                  <p className="mt-3 text-gray-200 leading-relaxed">
                    <span className="font-semibold text-white">
                      {reel?.user?.username}
                    </span>
                    <span className="ml-2">{reel?.caption}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right side media actions */}
            <div className="absolute -right-1 bottom-8 flex flex-col items-center gap-5 text-white">
              <div className="relative">
                <LikeButton type="reels" item={reel} />
                {reel?.likes?.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow">
                    {reel?.likes?.length || 0}
                  </span>
                )}
              </div>

              <button className="relative">
                <MessageCircle
                  size={26}
                  onClick={() => handleOpenComments(reel)}
                  className="hover:text-gray-300 transition"
                />
                {reel?.comments?.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow">
                    {reel?.comments?.length}
                  </span>
                )}
              </button>

              <button className="hover:text-gray-300 transition">
                <Send size={26} />
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* commentsNodal */}
      {isModalOpen && selectedReel && (
        <Modal
          openModal={() => setIsModalOpen(true)}
          onClose={handleCloseModal}
          initialHeight="h-auto"
          initialWidth="max-w-2xl"
        >

          <div className="flex flex-col w-full h-[500px] bg-black/50 rounded-lg">

            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-gray-700">
              <ProfileImage user={selectedReel?.user} />

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedReel?.user?.username}
                </h3>
                <p className="text-sm text-gray-400">
                  Comments {selectedReelComments?.length || 0}
                </p>
              </div>
            </div>

            {/* Comments section */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <CommentSection comments={selectedReelComments} />
            </div>

            <div className="flex shrink-0  p-3 border-t  border-gray-700 ">
              <CommentForm item={selectedReel} type="reels" currentUser ={currentUser} setComments={setSelectedReelComments} />
            </div>
            

          </div>



        </Modal>
      )}
    </div>
  );
}

export default Reels;
