import React, { useState } from 'react'
import ProfileImage from './ProfileImage';
import { axiosInstance } from '@/lib/axios';

function CommentForm({type="posts",item,currentUser,setComments}) {

    const [newComment,setNewComment] = useState("");
    const [isSubmitting,setIsSubmitting] =useState(false);
    
  const handleCommentSubmit = async(e)=>{

    // page reload na on submit mai agar hua to sari react render sb cahla jayega imp hai esi liye e.preventdefault
    e.preventDefault();
    if(!newComment.trim() || isSubmitting)return;
    setIsSubmitting(true);

    // Optimising UI: temporary comment bina refresh ke bs vo commnet dikhe jese hi refresh hoga api se pura comment ayega ye htt jaeyga

    const tempComment = {
        _id : `temp-${Date.now()}`,
        text:newComment,
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          _id: currentUser?._id,
          username:currentUser?.username,
          profileImage:currentUser?.profileImage,
        }
    }

    const commentText = newComment;  //db mai to yahi behjoge

    // if(onSubmit){
    //   onSubmit(tempComment);
    //   setNewComment("");
    //   setIsSubmitting(false);
    //   return
    // }

    // Original logic for post/reels

    setComments((prev)=>[tempComment,...prev]);
    setNewComment("");

    try{

      const {data} = await axiosInstance.post(`/${type}/${item?._id}/comment`,{text:commentText});
      console.log("data",data)

      if(data.success){
        setComments(data?.comments.slice().reverse());
      }else{
        throw new Error(data.message || "Failed to add comment")
      }

    }catch(error){
        
        setComments((prev)=>prev.filter((c)=> c?._id !==tempComment?._id));
        alert("Failed to add comment : Try again",error)
    }finally{
      setIsSubmitting(false)
    }




  }

  return (
    <form onSubmit={handleCommentSubmit} className='flex items-center gap-3 w-full'>
      <input type="text"
      value={newComment}
      onChange={(e)=>setNewComment(e.target.value)}
      placeholder='Add a comment'
      className='flex-1 bg-transparent outline-none text-sm text-gray-200 '
      disabled={isSubmitting}
       />
       <button type='submit' className='text-blue-500 font-semibold text-sm hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-2 py-1' disabled={!newComment.trim() || isSubmitting}>{isSubmitting ? "Posting...": "Post"}</button>
    </form>
  )
}

export default CommentForm
