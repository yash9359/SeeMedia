import { fetchSuggestedUsers } from '@/redux/slices/userSlice';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileImage from '@/components/ProfileImage';
import { Link } from 'react-router-dom';
import FollowButton from '@/components/FollowButton';
import Spinner from '@/components/Spinner';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { getAllPosts } from '@/redux/slices/postSlice';
import LikeButton from '@/components/LikeButton';
import Modal from '@/components/Modal';
import ProfileViewer from '@/components/ProfileViewer';

function Explore() {

  const dispatch = useDispatch()
  const { user: currentUser, suggestedUsers, error, loading } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef(null);

  // drag state
  const isDragging = useRef(null);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const scroll = (direction) => {

    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth / 2;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })


  }


  const checkScroll = () => {

    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);


  }


 const handleMouseDown = (e) => {
  isDragging.current = true;
  startX.current = e.pageX - scrollRef.current.offsetLeft;
  scrollLeftStart.current = scrollRef.current.scrollLeft;
};

const handleMouseMove = (e) => {
  if (!isDragging.current) return;

  e.preventDefault();

  const x = e.pageX - scrollRef.current.offsetLeft;
  const walk = (x - startX.current) * 1.5;

  scrollRef.current.scrollLeft = scrollLeftStart.current - walk;

  checkScroll();
};

const handleMouseUp = () => {
  isDragging.current = false;
};

const handleMouseLeave = () => {
  isDragging.current = false;
};
  // Touch Handlers(mobile)
 const handleTouchStart = (e) => {
  isDragging.current = true;
  startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
  scrollLeftStart.current = scrollRef.current.scrollLeft;
};

const handleTouchMove = (e) => {
  if (!isDragging.current) return;

  const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
  const walk = (x - startX.current) * 1.5;

  scrollRef.current.scrollLeft = scrollLeftStart.current - walk;

  checkScroll();
};

const handleTouchEnd = () => {
  isDragging.current = false;
};

  useEffect(()=>{
    checkScroll();
    const container = scrollRef.current 
    if(container){
      container.addEventListener("scroll",checkScroll);
      window.addEventListener("resize",checkScroll);
    }
    return ()=>{
      if(container) container.removeEventListener("scroll",checkScroll);
      window.removeEventListener("resize",checkScroll);
    }
  },[])


  // MOdal ka sb kuch
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const modalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const openModal = (index, contentArray) => {

    setIsModalOpen(true);
    setModalIndex(index);
    setModalContent(contentArray);

  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    dispatch(fetchSuggestedUsers());
    dispatch(getAllPosts())
  }, [dispatch]);


  return (

    <div className="bg-linear-to-br from-black via-zinc-900 to-black text-white w-full min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-5 w-full flex flex-col overflow-auto">
        {
          loading ? (<Spinner />) : (
            <div className='max-w-full '>
              {/* suggested Users */}
              <div className="relative mb-6">
                {/* left Scroll Button */}
                <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={`absolute rounded-xl left-0 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-700 z-10 md:p-3 transition-opacity ${!canScrollLeft ? "opacity-30 cursor-not-allowed " : ""} `}>
                  <ChevronLeft size={25} strokeWidth={2} />
                </button>

                {/* left Scroll Button */}
                <button onClick={() => scroll("right")} disabled={!canScrollRight} className={`absolute rounded-xl right-0 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-700 z-10 md:p-3 transition-opacity ${!canScrollRight ? "opacity-30 cursor-not-allowed " : ""} `}>
                  <ChevronRight size={25} strokeWidth={2} />
                </button>
                {/* scrollable Users List */}

                <div ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}

                 className='flex gap-4 px-4 md:px-8 py-2 overflow-x-auto no-scrollbar cursor-grab '>
                  {
                    suggestedUsers?.length === 0 ? (
                      <p className='text-gray-400'>No users found</p>
                    ) : (
                      suggestedUsers.map((user) => (
                        <Link
                          key={user?._id}
                          to={`/profile/${user?._id}`}
                          className='flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition min-w-20 md:min-w-25'
                        >

                          <ProfileImage
                            user={user}
                            className="h-15 w-15 md:w-20 md:h-20 rounded-full bg-linear-to-r from-pink-500/50 to-purple-500/50 shadow-pink-500/30"
                          />

                          <span className='text-sm md:text-base text-gray-400 text-center w-full truncate'>
                            {user?.username}
                          </span>

                        </Link>
                      ))
                    )
                  }
                </div>

              </div>

              {/* Posts Grid */}
              <div>
                <h2 className='text-lg md:text-xl font-semibold text-white mb-4 md:mb-5'>
                  Trending Posts
                </h2>

                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4'>

                  {
                    posts?.map((post, i) => (

                      <div
                        key={post?._id}
                        // important = posts likha hai aarri posts bhej rahe 
                        onClick={() => openModal(i, posts)}
                        className="relative h-40 sm:h-44 md:h-52 lg:h-56 w-full rounded-lg overflow-hidden group cursor-pointer"
                      >
                        {post?.mediaType === "image" ? (
                          <img
                            src={post?.mediaUrl}
                            alt={post?.caption || "image"}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <video
                            src={post?.mediaUrl}
                            loop
                            playsInline
                            muted
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 
                          bg-black/60 
                          opacity-100 md:opacity-0 md:group-hover:opacity-100 
                          transition-opacity duration-300 
                          px-2 py-1 sm:py-2 
                          flex items-center justify-between">

                          <div className="flex items-center gap-1 text-white">
                            <LikeButton type="posts" item={post} size={20} />
                            <span className='text-xs sm:text-sm'>
                              {post?.likes?.length || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2 text-white">
                            <MessageCircle size={20} strokeWidth={2} />
                            <span className='text-xs sm:text-sm'>
                              {post?.comments?.length || 0}
                            </span>
                          </div>

                        </div>
                      </div>
                    ))
                  }

                </div>
              </div>


            </div>
          )
        }

      </main>

      <Modal openModal={isModalOpen} onClose={handleCloseModal} initialHeight='h-[80vh]' initialWidth='max-w-5xl w-full'>
        <ProfileViewer
          content={modalContent}
          handleModalVideoClick={handleModalVideoClick}
          handleModalMuteToggle={handleModalMuteToggle}
          modalVideoRef={modalVideoRef}
          showIcon={showIcon}
          isMuted={isMuted}
          isPlaying={isPlaying}
          startIndex={modalIndex}
          currentUser={currentUser}
          type="posts"
        />
      </Modal>

    </div>
  )
}

export default Explore
