import { axiosInstance } from '@/lib/axios';
import { createSlice } from '@reduxjs/toolkit'



const initialState = {


    reels: [],
    loading: false,
    error: null,
    isAuthenticated: false


}

export const reelSlice = createSlice({
    name: 'reels',
    initialState,
    reducers: {


        setLoading: (state, action) => {

            state.loading = action.payload;

        },
        setReels: (state, action) => {

            state.reels = action.payload;
            state.isAuthenticated = !!action.payload;

        },
        // updateLikeStory: (state, action) => {
        //     const { storyId, userId } = action.payload;
        //     state.reels = state.reels.map((group) => ({
        //         ...group,
        //         reels: group.reels.map((story) =>{
                    
        //             if(story?._id === storyId){
        //                 const isLiked = story?.likes?.includes(userId);
        //                 return {
        //                     ...story,
        //                     likes: isLiked ? story.likes.filter((id)=>id !== userId) : [...story.likes,userId]
        //                 }
        //             }
        //             return story
        //         }
        //             ),
        //     }));
        // },
        setError: (state, action) => {
            state.error = action.payload;
        },


    },
})


export const { setReels, setError, updateLikeStory ,setLoading } = reelSlice.actions;

export default reelSlice.reducer;


// get current user details(profile)
export const getAllReels = () => async (dispatch) => {

    dispatch(setLoading(true));
    try {

        const { data } = await axiosInstance.get("/reels/all");
        if (data?.success) {

            dispatch(setReels(data?.reels));
        }
    } catch (error) {
        dispatch(setReels(null));
        dispatch(setError(error?.response?.data?.message || "Failed to fetch reels"));
    } finally {
        dispatch(setLoading(false));
    }
};
