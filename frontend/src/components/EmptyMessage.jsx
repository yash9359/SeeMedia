import { MessageCircle } from 'lucide-react'
import React from 'react'
import ProfileImage from './ProfileImage'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function EmptyMessage({ selectedUser }) {
    
    const {onlineUsers} = useSelector((state)=>state.user);
    const isOnline = onlineUsers?.includes(selectedUser?._id) ;
    const navigate = useNavigate()

    return (
 <div className='flex flex-col items-center justify-center text-center px-6 relative overflow-hidden min-h-[80vh]'>
            { !selectedUser ? (
                <div className='relative bg-white/5 backdrop-blur-xl border border-white/10 
                                p-7 rounded-3xl flex flex-col items-center gap-5 
                                shadow-[0_10px_60px_rgba(99,102,241,0.25)]
                                transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-indigo-500/20'>

                    <MessageCircle
                        size={52}
                        className='text-indigo-400 animate-bounce drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]'
                    />

                    <h2 className='text-2xl font-semibold text-white tracking-tight'>
                        No Messages Yet
                    </h2>

                    <p className='text-gray-400 max-w-xs leading-relaxed text-sm'>
                        Start a conversation by selecting a user from the sidebar.
                    </p>

                    <div className='w-28 h-0.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-80'></div>

                </div>
            ) : (
                <div className='relative bg-white/5 backdrop-blur-xl border border-white/10 
                                p-9 rounded-3xl shadow-[0_10px_60px_rgba(99,102,241,0.25)] 
                                flex flex-col max-w-md w-full items-center gap-5 
                                transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-indigo-500/20'>

                    <ProfileImage
                        user={selectedUser}
                        className="w-24 h-24 ring-2 ring-indigo-500/40 shadow-lg"
                    />

                    <h2 className='text-2xl font-semibold text-white tracking-tight'>
                        {selectedUser?.username || "Conversation"}
                    </h2>

                    {isOnline&& (
                        <p className='text-green-400 text-sm flex items-center gap-2'>
                            <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
                            Active now
                        </p>
                    )}

                    <button
                        onClick={() => navigate(`/profile/${selectedUser?._id}`)}
                        className='mt-3 px-6 py-2.5 rounded-full bg-linear-to-r from-gray-100 to-gray-300 
                                    text-gray-900 font-medium hover:scale-105 hover:shadow-md 
                                    transition-all duration-200 active:scale-95'>
                        View Profile
                    </button>

                </div>
            )}

        </div>
    )
}

export default EmptyMessage