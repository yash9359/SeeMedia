import { getUserById, logoutUser, setProfileUser } from "@/redux/slices/userSlice";
import  { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ProfileImage from "@/components/ProfileImage";
import FollowButton from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import { MessageCircle } from "lucide-react";
import Modal from "@/components/Modal";
import ProfileViewer from "@/components/ProfileViewer";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileUser = useSelector((state) => state?.user?.profileUser);
  const { user: currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const modalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleLikeUpdate = (updateItem) => {
    const keyMap = { posts: "posts", reels: "reels", saved: "savedPosts" };

    const key = keyMap[activeTab];

    if (profileUser && profileUser[key]) {
      const updateProfileUser = { ...profileUser };
      updateProfileUser[key] = updateProfileUser[key].map((item) => item?._id === updateItem?._id ? updateItem : item)

      dispatch(setProfileUser(updateProfileUser))
    }
    setModalContent((prev) => prev.map((item) => item?._id === updateItem?._id ? updateItem : item))
  };
  const getContentType = (tab) => {
    switch (tab) {
      case 'reels': return "reels";
      case 'posts': return "posts";
      default: return "posts";
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const openModal = (index, contentArray) => {
    setIsModalOpen(true);
    setModalIndex(index);
    setModalContent(contentArray);

  };

  const handleModalVideoClick = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play()
    }
    setIsPlaying(prev => !prev);
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 600);
  };

  const handleModalMuteToggle = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };



  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const renderGridContent = () => {
    if (!profileUser) return null;

    const keyMap = { posts: "posts", reels: "reels", saved: "savedPosts" };

    const content = profileUser?.[keyMap[activeTab]] || [];

    if (!content.length)
      return (
        <p className="text-center text-gray-500 col-span-full mt-6">
          No {activeTab}
        </p>
      );

    return content?.map((item, i) => (
      <div
        key={item?._id}
        onClick={() => openModal(i, content)}
        className="relative h-auto rounded-xl  aspect-square overflow-hidden group cursor-pointer"
      >
        {item?.mediaType === "image" ? (
          <img
            src={item?.mediaUrl}
            alt={item?.caption || "image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={item?.mediaUrl}
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {/* {Overlay} */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-6 text-white font-semibold text-lg">
            <div className="flex items-center gap-2">
              <LikeButton type={getContentType(activeTab)} size={24} onToggle={handleLikeUpdate} item={item} />
              <span> {item?.likes?.length || 0}</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle size={24} strokeWidth={2} item={item} />
              <span> {item?.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
   <div className="bg-linear-to-br from-black via-zinc-900 to-black text-white min-h-screen flex">
  <Sidebar />

  <main className="flex-1 w-full p-4 md:p-8 overflow-auto">
    <div className="w-full max-w-6xl mx-auto">

      {/* Profile Header */}
      <header className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-10 text-center lg:text-left">

        <ProfileImage
          user={profileUser}
          className="w-24 h-24 md:w-32 md:h-32 shrink-0 ring-2 ring-white/10 p-0.5 rounded-full"
        />

        <div className="w-full lg:max-w-4xl">

          <div className="flex flex-col md:flex-row flex-wrap justify-center lg:justify-start items-center gap-4 lg:gap-6 mb-4">

            <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
              {profileUser?.username || "Loading..."}
            </h1>

            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3">

              {/* BUTTON 1 */}
              {!profileUser ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
              ) : profileUser._id === currentUser?._id ? (
                <Link to="/account/edit">
                  <button className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 font-semibold text-sm md:text-base rounded-lg hover:scale-105 transition shadow-md">
                    Edit Profile
                  </button>
                </Link>
              ) : (
                <FollowButton
                  targetUserId={profileUser?._id}
                  currentUser={currentUser}
                />
              )}

              {/* BUTTON 2 */}
              {!profileUser ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
              ) : profileUser._id === currentUser?._id ? (
                <button
                  onClick={handleLogout}
                  className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 font-semibold text-sm md:text-base rounded-lg hover:scale-105 transition shadow-md"
                >
                  Logout
                </button>
              ) : (
                
                <Link to={`/chats`}>
                  <button className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 font-semibold text-sm md:text-base rounded-lg hover:scale-105 transition shadow-md">
                  Message
                </button>
                </Link>
              )}

            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center lg:justify-start gap-10 md:gap-14 mt-2">
            <div className="text-center">
              <span className="font-bold text-lg block">
                {profileUser?.posts?.length || 0}
              </span>
              <span className="text-sm text-gray-400">Posts</span>
            </div>

            <div className="text-center">
              <span className="font-bold text-lg block">
                {profileUser?.followers?.length || 0}
              </span>
              <span className="text-sm text-gray-400">Followers</span>
            </div>

            <div className="text-center">
              <span className="font-bold text-lg block">
                {profileUser?.following?.length || 0}
              </span>
              <span className="text-sm text-gray-400">Following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <h2 className="font-semibold text-white">
              {profileUser?.username}
            </h2>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              {profileUser?.bio || "Radhe Radhe"}
            </p>
          </div>

        </div>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-3  text-center border-t border-b border-white/10 mb-6 backdrop-blur-md">
        {["posts", "reels", "saved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-3 gap-2 mt-4">
        {renderGridContent()}
      </div>

    </div>
  </main>

  {/* Modal Viewer */}
  <Modal
    openModal={isModalOpen}
    onClose={handleCloseModal}
    initialWidth="max-w-5xl"
  >
    <ProfileViewer
      content={modalContent}
      handleModalVideoClick={handleModalVideoClick}
      handleModalMuteToggle={handleModalMuteToggle}
      modalVideoRef={modalVideoRef}
      showIcon={showIcon}
      isMuted={isMuted}
      isPlaying={isPlaying}
      startIndex={modalIndex}
      activeTab={activeTab}
      currentUser={currentUser}
      type={getContentType(activeTab)}
    />
  </Modal>
</div>
  );
}

export default Profile;
