import React from 'react'
import LikeButton from './LikeButton'
import { Bookmark, Heart, MessageCircle, SendHorizonal } from 'lucide-react'
import SaveButton from './SaveButton'


function MediaIcons({ type, shareIcon, item, size = 24, handleOpenModal, onLikeChange ,onToggle}) {
  return (
    <div className='flex justify-between items-center p-3 border-t border-gray-800'>
      <div className='flex items-center space-x-4 '>

        {/* Like btn Component */}
        <LikeButton type={type} item={item} size={size} onLikeChange={onLikeChange} onToggle={onToggle}/>

        <button onClick={() => handleOpenModal()} className='flex items-center justify-center text-gray-300'>
          <MessageCircle size={size} strokeWidth={2} />
        </button>

        {!shareIcon && <button className='flex items-center justify-center text-gray-300'>
          <SendHorizonal size={size} strokeWidth={2} />
        </button>}

      </div>

      {/* to save posts */}
      <SaveButton  post={item}/>

      

    </div>
  )
}

export default MediaIcons
