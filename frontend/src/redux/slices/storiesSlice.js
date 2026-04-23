import { axiosInstance } from '@/lib/axios';
import { createSlice } from '@reduxjs/toolkit'



const initialState = {


    stories: [],
    loading: false,
    error: null,
    isAuthenticated: false


}

export const storiesSlice = createSlice({
    name: 'stories',
    initialState,
    reducers: {


        setLoading: (state, action) => {

            state.loading = action.payload;

        },
        setStories: (state, action) => {

            state.stories = action.payload;
            state.isAuthenticated = !!action.payload;

        },
        updateLikeStory: (state, action) => {
            const { storyId, userId } = action.payload;
            state.stories = state.stories.map((group) => ({
                ...group,
                stories: group.stories.map((story) =>{
                    
                    if(story?._id === storyId){
                        const isLiked = story?.likes?.includes(userId);
                        return {
                            ...story,
                            likes: isLiked ? story.likes.filter((id)=>id !== userId) : [...story.likes,userId]
                        }
                    }
                    return story
                }
                    ),
            }));
        },
        setError: (state, action) => {
            state.error = action.payload;
        },


    },
})


export const { setStories, setError, updateLikeStory ,setLoading } = storiesSlice.actions;

export default storiesSlice.reducer;



// get current user details(profile)
export const getAllStories = () => async (dispatch) => {

    dispatch(setLoading(true));
    try {

        const { data } = await axiosInstance.get("/stories/all");
        if (data?.success) {

            dispatch(setStories(data?.stories));
        }
    } catch (error) {
        dispatch(setStories(null));
        dispatch(setError(error?.response?.data?.message || "Failed to fetch Stories"));
    } finally {
        dispatch(setLoading(false));
    }
};
