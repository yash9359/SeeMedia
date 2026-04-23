import { setPosts } from "@/redux/slices/postSlice";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios";
import {  updateLikeStory } from "@/redux/slices/storiesSlice";
import { setReels } from "@/redux/slices/reelSlice";

function LikeButton({ type, item, size = 24, onToggle }) {
  const { user: currentUser } = useSelector((state) => state?.user);
  const { posts } = useSelector((state) => state.posts);
  const { stories } = useSelector((state) => state.stories);
  const { reels } = useSelector((state) => state.reels);




  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!item || !currentUser?._id) {
      return;
    }
    const isPostLiked =
      item?.likes?.some((item) =>
        typeof item === "object"
          ? item?._id === currentUser?._id
          : item === currentUser?._id,
      ) || false;
    setIsLiked(isPostLiked);
  }, [currentUser, item]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();

    if (!item || !currentUser) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    const optimisticsLike = !isLiked;
    setIsLiked(optimisticsLike); //optimised Ui update
    //like Update by state
    // onLikeChange?.(optimisticsLike);

    if (!currentUser?._id) {
      return;
    }

    try {
      const { data } = await axiosInstance.put(`/${type}/${item?._id}/like`);

      if (data?.success) {
        const updateItem = data.post || data.reel || data.story || item;

        const likeNow = updateItem?.likes?.some(
          (item) => item?.toString() === currentUser?._id.toString(),
        );

        setIsLiked(likeNow);
        switch (type) {
          case "posts":
            dispatch(
              setPosts(
                posts.map((p) =>
                  p._id === updateItem?._id ? updateItem : p
                )
              )
            );
            break;
            
            case "reels":
            dispatch(
              setReels(
                reels.map((r) =>
                  r._id === updateItem?._id ? updateItem : r
                )
              )
            );
            break;

          case "stories":
            dispatch(
              updateLikeStory({
                storyId: updateItem?._id,
                userId: currentUser?._id // ye bhi pass karna padega
              })
            );
            break;


          default:
            break;
        }


        if (onToggle) onToggle(updateItem)
      } else {
        throw new Error(data.message || "Failed to save post");
      }
    } catch (error) {


      setIsLiked((prev) => !prev);
      console.log(" like Failed : Try again", error);
      toast.error(" Like Failed : Try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isSubmitting}
      className="flex items-center justify-center leading-none transition-transform hover:scale-110 active:scale-95"
    >
      {isLiked ? (
        <FaHeart size={size} className="block text-red-500" />
      ) : (
        <FaRegHeart size={size} className="block text-gray-300" />
      )}
    </button>
  );
}

export default LikeButton;
