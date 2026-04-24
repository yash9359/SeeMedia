import { axiosInstance } from "@/lib/axios";
import { getSocket } from "@/lib/socket";
import { createSlice } from "@reduxjs/toolkit";
import React from "react";
import toast from "react-hot-toast";

const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    typingUsers: {},
    loading: false,
    error: null,
};

export const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload

        },
        setAllUsersForMessage: (state, action) => {
            state.users = action.payload
        },
        setTypingStatus: (state, action) => {
            const { userId, isTyping } = action.payload || {};
            if (!userId) return;

            if (isTyping) {
                state.typingUsers[userId] = true;
            } else {
                delete state.typingUsers[userId];
            }
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    addMessage,
    setAllUsersForMessage,
    setMessages,
    setSelectedUser,
    setTypingStatus,
    setError,
    setLoading,
} = messageSlice.actions;

export default messageSlice.reducer;

// Send Messages
export const sendMessage = (formData) => async (dispatch, getState) => {

    dispatch(setLoading(true));
    const { selectedUser } = getState().messages;

    if (!selectedUser) return;

    console.log("formData", formData)


    try {
        const { data } = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (data?.success) {
            dispatch(addMessage(data?.data));
        }
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Failed to Send Message"),

        );
        toast.error("Failed to Send Message")
    } finally {
        dispatch(setLoading(false));
    }
};

// get all messages with specific user
export const getAllMessages = (receiverId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get(`/messages/${receiverId}`);
        if (data?.success) {
            console.log("data", data)
            dispatch(setMessages(data?.data));

        }
    } catch (error) {
        console.log("GET MESSAGES ERROR:", error);
        dispatch(

            setError(error?.response?.data?.message || "Get all Messages Failed"),

        );
        toast.error("Get all Messages Failed")
    } finally {
        dispatch(setLoading(false));
    }
};

// get all users for message
export const getAllUsersForMessage = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axiosInstance.get(`/messages/users`);
        if (data?.success) {
            dispatch(setAllUsersForMessage(data?.users));
        }
    } catch (error) {
        dispatch(
            setError(error?.response?.data?.message || "Get all Users Failed"),
        );
    } finally {
        dispatch(setLoading(false));
    }
};

// Subscribe to message from the selected User
export const subscribeMessages = () => async (dispatch, getState) => {

    const { selectedUser } = getState().messages;
    if (!selectedUser) return;

    const socket = getSocket();

    if (!socket) return;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");

    socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedUser?._id) {
            return;
        }
        dispatch(addMessage(newMessage))
    })

    socket.on("typing", ({ senderId } = {}) => {
        if (senderId !== selectedUser?._id) return;
        dispatch(setTypingStatus({ userId: senderId, isTyping: true }));
    });

    socket.on("stopTyping", ({ senderId } = {}) => {
        if (senderId !== selectedUser?._id) return;
        dispatch(setTypingStatus({ userId: senderId, isTyping: false }));
    });


}

// UnSubscribe from new message 
export const unSubscribeMessages = () => async (dispatch, getState) => {

   

    const socket = getSocket();

    if (!socket) return;
    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");


}