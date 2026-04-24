import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast'
import { followUserAction, unfollowUserAction } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';

function FollowButton({ targetUserId, currentUser, className = "", variant = "default" }) {

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

  const profileStyle = isFollowing
    ? "border-white/25 bg-white/5 text-gray-200 hover:border-red-400/50 hover:text-red-300 hover:scale-105"
    : "bg-linear-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:scale-105 hover:shadow-lg";

  const defaultStyle = isFollowing
    ? "border-white/20 bg-white/5 text-gray-200 hover:border-red-400/50 hover:text-red-300"
    : "border-indigo-500/40 bg-linear-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400";

  const variantStyle = variant === "profile" ? profileStyle : defaultStyle;

  const sizeStyle = variant === "profile"
    ? "h-10 min-w-28 px-5"
    : "py-2 px-4";

  return (

    <button 
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`${sizeStyle} rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-70 ${variantStyle} ${className}`}
    >
      {loading ? "..." : isFollowing ? (hovering ? "Unfollow" : "Following") : "Follow"}
    </button>
    
  
    
  )
}

export default FollowButton
