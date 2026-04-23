import { Bookmark, BookmarkCheck, BookmarkCheckIcon, BookmarkPlus } from "lucide-react";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSavedPosts } from "@/redux/slices/userSlice";
function SaveButton({ post }) {


  const { user: currentUser } = useSelector((state) => state?.user);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch =useDispatch();
  
  useEffect(()=>{
    if(!currentUser?._id){
      setIsSaved(false);
      return
    }
    const savedCurrentUserPostsChecked = currentUser?.savedPosts?.some((item) => typeof item ==="object" ? item?._id === post?._id : item === post?._id) || false;
      setIsSaved(savedCurrentUserPostsChecked) 
  },[currentUser?._id,currentUser?.savedPosts,post?._id])

  const handleSavePost = async (e) => {
    

    if(!currentUser?._id){
      return
    }
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.put(`/posts/${post?._id}/save`);
      console.log("data", data);

      if (data?.success) {
        //Update redux Store
        dispatch(setSavedPosts(data?.savedPosts));
        // Update Local state
        const isPostSaved = data.savedPosts.some(item=> item.toString() === post?._id.toString());

        setIsSaved(isPostSaved);

        toast.success(data.message);
      } else {
        throw new Error(data.message || "Failed to save post");
      }
    } catch (error) {
      console.log("Failed to save Post : Try again", error);
      toast.error("Failed to save Post : Try again");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <button onClick={handleSavePost} disabled={isLoading} className={`flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ""}`}>
      {
         isSaved ? <BookmarkCheck/> : <Bookmark size={24} className="text-gray-300" /> 
      }
     
     
    </button>
  );
}

export default SaveButton;
