import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast'
import { followUserAction, unfollowUserAction } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';

function FollowButton({targetUserId, currentUser}) {

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
      className='py-2 px-4 rounded-md transition-all duration-200 active:scale-95 text-blue-500  hover:text-blue-700'
    >
      {loading ? "..." : isFollowing ? "UnFollow" : "Follow"}
    </button>
    
  
    
  )
}

export default FollowButton
