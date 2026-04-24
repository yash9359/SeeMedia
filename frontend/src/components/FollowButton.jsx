import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast'
import { followUserAction, unfollowUserAction } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';

function FollowButton({ targetUserId, currentUser, className = "" }) {

  const [isFollowing,setIsFollowing] = useState(false);
  const [loading,setLoading] =useState(false);
  const [hovering,setHovering] =useState(false);

  const dispatch = useDispatch();

  useEffect(()=>{
      if(currentUser?._id && currentUser?.following){
        setIsFollowing(currentUser?.following.includes(targetUserId))
      }
  },[currentUser,targetUserId])

    const handleFollowToggle =  async()=>{
        if(!currentUser?._id){
          return toast.error("Please login to follow users")
        }
        const prevState = isFollowing;
         // update Local State(optimistic update)
        setIsFollowing(!isFollowing)
        setLoading(true);
        try {
          let success = false;
          if(prevState){
            success = await dispatch(unfollowUserAction(targetUserId));
          }
          else{
            success = await dispatch(followUserAction(targetUserId));
            
          }

          if(!success){
            setIsFollowing(prevState);
          }
        } catch (error) {
          //  RollBack
          setIsFollowing(prevState);
          console.log("Error whlie follow unollow ",error)
        }finally{
          setLoading(false);
        }
      }




  return (

    <button 
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-70 ${
        isFollowing
          ? "border-white/20 bg-white/5 text-gray-200 hover:border-red-400/50 hover:text-red-300"
          : "border-indigo-500/40 bg-linear-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400"
      } ${className}`}
    >
      {loading ? "..." : isFollowing ? (hovering ? "Unfollow" : "Following") : "Follow"}
    </button>
    
  
    
  )
}

export default FollowButton
