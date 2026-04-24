import React from 'react'
import ProfileImage from './ProfileImage'
import { Link } from "react-router-dom"
import { MessageCircleMore } from 'lucide-react'
import { timeAgo } from '@/lib/timeAgo';

function CommentSection({ comments }) {

    return (
        <div className='flex-1 flex flex-col'>
            
            <div className="flex-1 overflow-y-auto">
                {
                    comments?.length > 0 ? (
                        <div className='space-y-4 px-4 py-3'>
                            {comments.map(c => (
                                <div key={c?._id} className='flex gap-3 items-start group'>
                                    
                                    <div className="flex shrink-0">
                                        <ProfileImage user={c?.user} />
                                    </div>

                                    <div className='flex-1 min-h-0'>
                                        
                                        <div className='flex items-center gap-2 mb-1'>
                                            <Link 
                                              to={`/profile/${c?.user?._id}`} 
                                              className='hover:underline flex items-center gap-2'
                                            >
                                                <span className='font-semibold text-white text-sm'>
                                                    {c?.user?.username}
                                                </span>
                                            </Link>

                                            <span className='text-gray-400 text-xs'>
                                            {timeAgo(c?.createdAt)}
                                            </span>
                                        </div>

                                        <p className='text-gray-200 text-sm wrap-break-word leading-relaxed'>
                                            {c?.text}
                                        </p>

                                        <div className='flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <button className='text-gray-400 hover:text-white text-xs'>
                                                Likes
                                            </button>

                                            <button className='text-gray-400 hover:text-white text-xs'>
                                                Reply
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-1 flex-col items-center justify-center px-4'>
                            <div className='text-gray-400 mt-25 mb-2'>
                                <MessageCircleMore size={80} />
                            </div>
                            <p className='text-gray-400 text-sm font-medium'>
                                No Comments
                            </p>
                            <p className='text-gray-500 text-xs mt-1'>
                                Start messaging!
                            </p>
                        </div>
                    )
                }
            </div>

        </div>
    );
}

export default CommentSection
