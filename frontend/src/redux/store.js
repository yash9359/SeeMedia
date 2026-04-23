import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from './slices/userSlice';
import Stories from '@/components/Stories';
import  storiesSlice  from './slices/storiesSlice';
import  postSlice  from './slices/postSlice';
import  reelSlice  from './slices/reelSlice';
import messageSlice  from './slices/messageSlice';


const store = configureStore({
  reducer: {
    user: userSlice,
    stories : storiesSlice,
    posts:postSlice,
    reels:reelSlice,
    messages: messageSlice,
  },
})

export default store ;