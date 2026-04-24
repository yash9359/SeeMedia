import { axiosInstance, clearAuthToken, setAuthToken } from "@/lib/axios";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    user: null,
    authChecked: false,
    profileUser: null,
    suggestedUsers: [],
    suggestedUsersLoading: false,
    suggestedUsersError: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    followers: [],
    following: [],
    onlineUsers: [],
    notification: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
            if (!action.payload) {
                state.suggestedUsers = [];
                state.suggestedUsersError = null;
            }
        },
        setAuthChecked: (state, action) => {
            state.authChecked = action.payload;
        },
        setProfileUser: (state, action) => {
            state.profileUser = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
            state.suggestedUsersError = null;

        },
        setSuggestedUsersLoading: (state, action) => {
            state.suggestedUsersLoading = action.payload;
        },
        setSuggestedUsersError: (state, action) => {
            state.suggestedUsersError = action.payload;
        },
        updateFollowers: (state, action) => {
            if (state.profileUser) state.profileUser.followers = action.payload;
        },
        updateFollowing: (state, action) => {
            if (state.profileUser) state.profileUser.following = action.payload;
        },
        setFollowers: (state, action) => {
            state.followers = action.payload;
            state.error = null;
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
            state.error = null;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
        setSavedPosts: (state, action) => {
            if (state.user) {
                state.user.savedPosts = [...action.payload];
            }
        },
        setNotification: (state, action) => {
            const { type, userId, postId, targetUserId } = action.payload;

            if (type === "unlike" || type === "unfollow") {

                if (type === "unlike") {
                    // remove Like notification

                    state.notification = state.notification.filter((notify) =>
                        !(
                            notify.type === "like" &&
                            notify.userId === userId &&
                            notify.postId === postId

                        )
                    );
                } 
                //remove follow notification
                else if (type === "unfollow") {
                    state.notification = state.notification.filter((notify) =>
                        !(
                            notify.type === "follow" &&
                            notify.userId === userId &&
                            notify.targetUserId === targetUserId

                        ))
                }
                return;
            }


            // Handle Adiition Cases

            if (type === "like" || type === "follow") {

                if (type === "like") {
                    // remove Like notification

                    state.notification = state.notification.filter((notify) =>
                        !(
                            notify.type === "like" &&
                            notify.userId === userId &&
                            notify.postId === postId

                        )
                    );
                } 
                //remove follow notification
                else if (type === "follow") {
                    state.notification = state.notification.filter((notify) =>
                        !(
                            notify.type === "follow" &&
                            notify.userId === userId &&
                            notify.targetUserId === targetUserId

                        ))
                }
                
                state.notification.unshift(action.payload);
            }
        },
    },
});

export const {
    setUser,
    setError,
    setAuthChecked,
    setOnlineUsers,
    setFollowers,
    setFollowing,
    updateFollowers,
    updateFollowing,
    setProfileUser,
    setLoading,
    setSuggestedUsers,
    setSuggestedUsersLoading,
    setSuggestedUsersError,
    setSavedPosts,
    setNotification,
} = userSlice.actions;

export default userSlice.reducer;


const setupSocketConnection = (userId, dispatch) => {
    const socket = connectSocket(userId);
    if (!socket) return;

    socket.off("getOnlineUsers");
    socket.off("notification");
    socket.off("connect_error");
    socket.off("disconnect");

    // taking online users From Backend Socket wahaa socket le map mai id padi hai users ki wahi se waha emit kiya hai socket.js mai
    socket.on("getOnlineUsers", (userIds) => {
        dispatch(setOnlineUsers(userIds));
    })

     socket.on("notification", (notification) => {
        dispatch(setNotification(notification));
    })

    socket.on("connect_error", (error) => {
        console.log("Error : Socket connection Error", error)
    });

    /// at the time of disconnect
    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected", reason);

        if (reason === "io server disconnect") {
            socket.connect();
        }
    });

}

const cleanupSocketConnection = (socket) => {

    if (socket) {
        socket.off("getOnlineUsers")
        socket.off("connect_error")
        socket.off("disconnect")
        socket.off("notification");
        disconnectSocket();
    }

}

// register user
export const registerUser = (userData) => async (dispatch) => {
    dispatch(setLoading(true));
    const registerToastId = toast.loading("Creating account...");
    try {
        const { data } = await axiosInstance.post("/users/register", userData);
        if (data?.success) {
            if (data?.token) {
                setAuthToken(data.token);
            }
            dispatch(setUser(data?.user));
            dispatch(setAuthChecked(true));
            await dispatch(fetchSuggestedUsers());
            setupSocketConnection(data?.user?._id, dispatch)
            toast.success(data.message || "Registered Successfully", { id: registerToastId });


            // if (navigate) navigate("/");
        } else {
            toast.dismiss(registerToastId);
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Registration Failed"));
        toast.error(error?.response?.data?.message || "Registration Failed", { id: registerToastId });
    } finally {
        dispatch(setLoading(false));
    }
};

// login user
export const loginUser = (userData) => async (dispatch) => {
    dispatch(setLoading(true));
    const loginToastId = toast.loading("Logging in...");
    try {
        const { data } = await axiosInstance.post("/users/login", userData);
        if (data?.success) {
            if (data?.token) {
                setAuthToken(data.token);
            }
            dispatch(setUser(data?.user));
            dispatch(setAuthChecked(true));
            await dispatch(fetchSuggestedUsers());

            setupSocketConnection(data?.user?._id, dispatch)

            toast.success(data.message || "Logged In Successfully", { id: loginToastId });

            // if (navigate) navigate("/");
        } else {
            toast.dismiss(loginToastId);
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Login Failed"));
        toast.error(error?.response?.data?.message || "Login Failed", { id: loginToastId });
    } finally {
        dispatch(setLoading(false));
    }
};

// get current user details(profile)
export const getCurrentUser = () => async (dispatch) => {
    dispatch(setAuthChecked(false));
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get("/users/profile");
        if (data?.success) {
            dispatch(setUser(data?.user));
            setupSocketConnection(data?.user?._id, dispatch)
        }
    } catch (error) {
        dispatch(setUser(null));
        dispatch(
            setError(
                error?.response?.data?.message || "Failed to fetch Profile details",
            ),
        );
    } finally {
        dispatch(setLoading(false));
        dispatch(setAuthChecked(true));
    }
};

// logout user
export const logoutUser = (navigate) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get("/users/logout");
        const socket = getSocket();
        if (data?.success) {

            cleanupSocketConnection(socket);
            clearAuthToken();
            dispatch(setUser(null));
            toast.success(data.message || "Logged Out Successfully");
            if (typeof navigate === "function") {
                navigate("/");
            }
        }
    } catch (error) {
        clearAuthToken();
        dispatch(setError(error?.response?.data?.message || "Failed to Logout"));
        toast.error(error?.response?.data?.message || "Failed to Logout");
    } finally {
        dispatch(setLoading(false));
    }
};

// update profile image
export const updateProfileImage = (formData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.put("/users/upload-profile", formData);
        if (data?.success) {
            dispatch(setUser(data?.user));

            toast.success(data.message || "Profile Image Updated Successfully");
        }
    } catch (error) {
        dispatch(
            setError(
                error?.response?.data?.message || "Failed to update Profile Image",
            ),
        );
        toast.error(
            error?.response?.data?.message || "Failed to update Profile Image",
        );
    } finally {
        dispatch(setLoading(false));
    }
};

// update profile
export const updateProfileUser = (userData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.put("/users/update-profile", userData);
        if (data?.success) {
            dispatch(setUser(data?.user));

            toast.success(data.message || "Profile Updated Successfully");
        }
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Failed to update Profile"),
        );
        toast.error(error?.response?.data?.message || "Failed to update Profile");
    } finally {
        dispatch(setLoading(false));
    }
};

//   get User by id (for profile page)

export const getUserById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get(`/users/${id}`);
        if (data?.success) {
            dispatch(setProfileUser(data?.user));
        }
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Get Profile By Id failed"),
        );
        toast.error(error?.response?.data?.message || "Get Profile By Id failed");
    } finally {
        dispatch(setLoading(false));
    }
};
// suggestedUsers
export const fetchSuggestedUsers = (options = {}) => async (dispatch) => {
    dispatch(setSuggestedUsersLoading(true));
    try {
        const params = new URLSearchParams();

        if (options?.all) {
            params.set("all", "true");
        } else if (options?.limit) {
            params.set("limit", String(options.limit));
        }

        const query = params.toString();
        const { data } = await axiosInstance.get(
            `/users/suggested/users${query ? `?${query}` : ""}`,
        );
        if (data?.success) {
            dispatch(setSuggestedUsers(data?.users));
        }
    } catch (error) {
        dispatch(
            setSuggestedUsersError(error?.response?.data?.message || "Failed to fetch suggested users"),
        );
        toast.error(error?.response?.data?.message || "Failed to fetch suggested users");
    } finally {
        dispatch(setSuggestedUsersLoading(false));
    }
};

// follow User

export const followUserAction = (targetUserId) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.post(`/users/follow/${targetUserId}`);

        if (data?.success) {
            toast.success(data.message || "Follow Successfully");

            const state = getState().user;

            //  Update current user (following list)
            if (
                state?.user &&
                !state.user.following?.some(
                    (id) => id.toString() === targetUserId.toString(),
                )
            ) {
                const updatedUser = {
                    ...state.user,
                    following: [...(state.user.following || []), targetUserId],
                };
                dispatch(setUser(updatedUser));
            }

            //  Update profile user (followers list)
            if (
                state?.profileUser &&
                state.profileUser._id?.toString() === targetUserId.toString()
            ) {
                const updatedProfileUser = {
                    ...state.profileUser,
                    followers: [...(state.profileUser.followers || []), state.user._id],
                };
                dispatch(setProfileUser(updatedProfileUser));
            }

            return true;
        }

        return false;
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Failed to follow User")
        );
        toast.error(error?.response?.data?.message || "Failed to follow User");
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

// Unfollow User

export const unfollowUserAction = (targetUserId) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.post(`/users/unfollow/${targetUserId}`);

        if (data?.success) {
            toast.success(data.message || "UnFollow Successfully");

            const state = getState().user;

            //  Update current user (following list)
            if (
                state?.user &&
                state.user.following?.some(
                    (id) => id.toString() === targetUserId.toString(),
                )
            ) {
                const updatedUser = {
                    ...state.user,
                    following: (state.user.following || []).filter(
                        (id) => id.toString() !== targetUserId.toString(),
                    ),
                };
                dispatch(setUser(updatedUser));
            }

            //  Update profile user (followers list)
            if (
                state?.profileUser &&
                state.profileUser._id?.toString() === targetUserId.toString()
            ) {
                const updatedProfileUser = {
                    ...state.profileUser,
                    followers: (state.profileUser.followers || []).filter(
                        (id) => id.toString() !== state.user._id.toString(),
                    ),
                };
                dispatch(setProfileUser(updatedProfileUser));
            }

            return true;
        }

        return false;
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Failed to unfollow User"),
        );
        toast.error(error?.response?.data?.message || "Failed to unfollow User");
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

//  fetchFollowers
export const fetchFollowers = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get(`/users/${id}/followers`);
        if (data?.success) {
            dispatch(setFollowers(data?.followers || []));
            dispatch(updateFollowers(data?.followers || []));
        }
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Get Followers failed"),
        );
        toast.error(error?.response?.data?.message || "Get Followers failed");
    } finally {
        dispatch(setLoading(false));
    }
};

// fetchFollowing
export const fetchFollowing = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get(`/users/${id}/following`);
        if (data?.success) {
            dispatch(setFollowing(data?.following || []));
            dispatch(updateFollowing(data?.following || []));
        }
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Get Following failed"),
        );
        toast.error(error?.response?.data?.message || "Get Following failed");
    } finally {
        dispatch(setLoading(false));
    }
};

