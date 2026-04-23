import { axiosInstance } from '@/lib/axios';
import { createSlice } from '@reduxjs/toolkit'


const initialState = {


    posts: [],
    loading: false,
    error: null,
    isAuthenticated: false


}

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {


        setLoading: (state, action) => {

            state.loading = action.payload;

        },
        setPosts: (state, action) => {

            state.posts = action.payload;
            state.isAuthenticated = !!action.payload;

        },
        setError: (state, action) => {
            state.error = action.payload;
        },


    },
})


export const { setPosts, setError, setLoading } = postSlice.actions;

export default postSlice.reducer;



// get current user details(profile)
export const getAllPosts = () => async (dispatch) => {

    dispatch(setLoading(true));
    try {

        const { data } = await axiosInstance.get("/posts/all");
        if (data?.success) {

            dispatch(setPosts(data?.posts));
        }
    } catch (error) {
        dispatch(setPosts(null));
        dispatch(setError(error?.response?.data?.message || "Failed to fetch posts"));
    } finally {
        dispatch(setLoading(false));
    }
};
