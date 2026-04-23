import React from 'react'
import { VolumeX, Play, Pause, Volume2 } from 'lucide-react'

function Media({ media, isPlaying, videoRef, showIcon, handleMuteToggle, isMuted, handleVideoClick }) {
    return (
        <div>
            <div className='w-full h-100 sm:h-75 md:h-100 overflow-hidden'>
                {
                    media?.mediaType === "image" ? <img src={media?.mediaUrl} alt={media?.caption} className='w-full h-full object-cover ' /> :
                        <div className='relative w-full h-full '>
                            <video ref={videoRef} src={media?.mediaUrl} loop playsInline muted={isMuted} onClick={handleVideoClick} className='w-full h-full object-cover '></video>

                            {showIcon && <div className='absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500'>

                                <button className='bg-black/50 p-2 rounded-full text-center text-6xl opacity-80'>
                                    {
                                        isPlaying ? <Pause size={24} className='text-white' /> : <Play size={24} />
                                    }
                                </button>

                            </div>}

                            <button onClick={handleMuteToggle} className='absolute top-2 right-2 bg-black/50 p-2 rounded-full text-center text-6xl opacity-80'>
                                {
                                    isMuted ? <VolumeX size={18} className='text-white/70' /> : <Volume2 size={18} className='text-white' />
                                }
                            </button>


                        </div>

                }
            </div>
        </div>
    )
}

export default Media
