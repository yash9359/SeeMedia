import ChatInput from '@/components/ChatInput';
import EmptyMessage from '@/components/EmptyMessage';
import MessageSideBar from '@/components/MessageSideBar'
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import { getSocket } from '@/lib/socket';
import { getAllMessages, sendMessage, subscribeMessages, unSubscribeMessages } from '@/redux/slices/messageSlice';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


function Message() {
  const dispatch = useDispatch()
  const { selectedUser, messages, typingUsers } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector(state => state.user);
  const isSelectedUserTyping = selectedUser?._id ? Boolean(typingUsers[selectedUser._id]) : false;

  const chatMedia = useMemo(() => {
    return messages
      .filter((m) => m.mediaUrl)
      .map((m) => ({
        mediaUrl: m.mediaUrl,
        mediaType: m.mediaType
      }));
  }, [messages]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted,setIsMuted] = useState(true);
  const [mediaIndex,setMediaIndex] = useState(0);






  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const typingTimeoutRef = useRef(null);

  const emitTypingEvent = useCallback((isTyping) => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    socket.emit(isTyping ? "typing" : "stopTyping", {
      receiverId: selectedUser._id,
    });
  }, [selectedUser?._id]);

  const scrollToBottom = useCallback((behavior = "auto") => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  const handleMessagesScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 80;
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    shouldAutoScrollRef.current = distanceFromBottom <= threshold;
  }, []);

  // user switch pe niche se start karo
  useEffect(() => {
    shouldAutoScrollRef.current = true;
  }, [selectedUser?._id]);

  // naya message aaye to bottom pe auto-scroll (agar user upar manually read nahi kar raha)
  useLayoutEffect(() => {
    if (!selectedUser?._id) return;
    if (!shouldAutoScrollRef.current) return;

    requestAnimationFrame(() => {
      scrollToBottom("auto");
    });
  }, [messages, selectedUser?._id, scrollToBottom]);

  const handleMediaLoaded = useCallback(() => {
    if (!shouldAutoScrollRef.current) return;
    scrollToBottom("auto");
  }, [scrollToBottom]);




  const handleSend = (text, file) => {
    const safeText = typeof text === "string" ? text : "";

    if (!safeText.trim() && !file) return;

    // sender ke message pe hamesha latest pe le jao
    shouldAutoScrollRef.current = true;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    emitTypingEvent(false);
    
    console.log("text", text);
    console.log("file", file);

    const formData = new FormData();

    if (safeText.trim()) formData.append("text", safeText);
    if (file) formData.append("media", file);
    dispatch(sendMessage(formData));
    
    
    
  }

  const handleTypingChange = useCallback((isTyping) => {
    if (!selectedUser?._id) return;

    if (isTyping) {
      emitTypingEvent(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emitTypingEvent(false);
        typingTimeoutRef.current = null;
      }, 1200);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    emitTypingEvent(false);
  }, [emitTypingEvent, selectedUser?._id]);
  
  const openMediaModal = (msg) => {
     if (msg?.mediaType !== "image") return;

    const index = chatMedia.findIndex((m)=>m.mediaUrl === msg.mediaUrl);
    setMediaIndex(index >=0 ? index : 0);
    setSelectedMedia(msg);
    setIsModalOpen(true);
    setIsPlaying(msg.mediaType === "video");
    setIsMuted(true);

  }
   const closeMediaModal = () => {

    setSelectedMedia(null);
    setIsModalOpen(false);
    setIsPlaying(false);
    setIsMuted(true);

  }
  
  useEffect(() => {

    if (selectedUser?._id){
        dispatch(getAllMessages(selectedUser?._id))
        dispatch(subscribeMessages())
    }
    return () =>dispatch(unSubscribeMessages())

  }, [dispatch, selectedUser?._id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      emitTypingEvent(false);
    };
  }, [emitTypingEvent]);



 return (
  <div className='h-screen overflow-hidden bg-linear-to-br from-black via-zinc-900 to-black text-white flex'>
    <MessageSideBar />

    <main className='h-screen flex-1 min-w-0 overflow-hidden'>
      <div className='h-full flex flex-col'>

        {!selectedUser ? (
          <EmptyMessage selectedUser={selectedUser} />
        ) : (
          <>
            {/* Header */}
            <div className='sticky top-0 z-20 border-b border-white/10 
            py-2 sm:py-3 px-3 sm:px-5 md:px-8 
            bg-black/60 backdrop-blur-lg 
            flex items-center gap-2 sm:gap-3'>

              <ProfileImage user={selectedUser} username />
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className='flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 
              space-y-2 sm:space-y-3 no-scrollbar scroll-smooth'
            >

              {messages.length === 0 ? (
                <EmptyMessage selectedUser={selectedUser} />
              ) : (
                messages.map((msg, idx) => {
                  const isSender = msg.senderId === currentUser?._id;

                  return (
                    <div
                      key={idx}
                      className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                        max-w-[90%] sm:max-w-[75%] md:max-w-[60%]
                        px-3 py-2 sm:px-4 sm:py-2.5 
                        rounded-2xl shadow-md
                        ${isSender
                            ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-br-md"
                            : "bg-zinc-200 text-black rounded-bl-md"
                          }
                        space-y-2 cursor-pointer
                        hover:scale-[1.01] active:scale-[0.98]
                        transition-transform duration-150
                        `}
                        onClick={() => msg?.mediaUrl && openMediaModal(msg)}
                      >

                        {msg?.text && (
                          <p className='wrap-break-word text-sm sm:text-base leading-relaxed'>
                            {msg.text}
                          </p>
                        )}

                        {msg?.mediaUrl && msg?.mediaType === "image" && (
                          <img
                            src={msg.mediaUrl}
                            alt="image"
                            onLoad={handleMediaLoaded}
                            className='w-full max-h-52 sm:max-h-64 md:max-h-72 object-contain rounded-lg'
                          />
                        )}

                        {msg?.mediaUrl && msg?.mediaType === "video" && (
                          <video
                            src={msg.mediaUrl}
                            controls
                            onLoadedMetadata={handleMediaLoaded}
                            className='w-full max-h-52 sm:max-h-64 md:max-h-72 rounded-lg'
                          />
                        )}

                      </div>
                    </div>
                  );
                })
              )}

              {isSelectedUserTyping && (
                <div className='flex justify-start'>
                  <div className='bg-zinc-200 text-black rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-2.5 shadow-md'>
                    <div className='flex items-center gap-1'>
                      <span className='w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:-0.2s]'></span>
                      <span className='w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:-0.1s]'></span>
                      <span className='w-2 h-2 rounded-full bg-zinc-600 animate-bounce'></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>
          </>
        )}

        {selectedUser && (
          <ChatInput handleSend={handleSend} onTypingChange={handleTypingChange} />
        )}

      </div>
    </main>

    <Modal openModal={isModalOpen} onClose={closeMediaModal}>
      <div className='flex items-center justify-center w-full p-4'>
        
        {selectedMedia?.mediaType === 'image' && (
          <img
            src={selectedMedia?.mediaUrl}
            alt="image"
            className='max-w-full sm:max-w-[80vw] md:max-w-[70vw] 
            max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-lg'
          />
        )}

      </div>
    </Modal>

  </div>
);
}

export default Message
