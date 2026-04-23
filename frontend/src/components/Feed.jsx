import { getAllPosts } from '@/redux/slices/postSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostCard from './PostCard';
import { statsBuffer } from 'framer-motion';

function Feed() {

    const dispatch = useDispatch();
    
    //redux se saari post managyi
    const {posts} = useSelector(state=>state?.posts);

    //current user jo post dekh raha hai vo mangaya
    const {user:currentUser}  = useSelector(state=>state?.user)
    const [isMuted,setIsMuted] = useState(true);


    useEffect (()=>{
        dispatch(getAllPosts())
    },[dispatch])


  return (
    <div className='flex flex-col items-center w-full'>
     {posts?.map((post)=> <PostCard key={post?._id}  isMuted={isMuted} setIsMuted={setIsMuted} post={post} currentUser={currentUser}/>)}
    </div>
  )
}

export default Feed
