import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Check, CloudUploadIcon } from "lucide-react";

function ChatInput({ handleSend }) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);

    const pickerRef = useRef();

    const onEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setShowEmoji(false);
    };
    const handleChangeFile = (e) => {
        setFile(e.target.files[0]);
    };
    const sendMessage = () => {

        if (!message.trim() && !file) return;

        handleSend(message, file);
        setMessage("");
        setFile(null);
    };

    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowEmoji(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        };
    }, []);

    return (
        <div className="sticky bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-2 sm:p-3 flex flex-col gap-2">

            {/* File Preview */}
            {file && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-2 rounded-lg overflow-hidden shadow-lg border border-white/10">
                    {file.type.startsWith("image") ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video
                            controls
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <button
                        onClick={() => setFile(null)}
                        className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full px-2 py-0.5 text-xs hover:bg-red-600 transition"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Input Row */}
            <div className="flex items-center gap-2 w-full">

                {/* Left Controls */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Emoji */}
                    <div className="relative" ref={pickerRef}>
                        <button
                            onClick={() => setShowEmoji(!showEmoji)}
                            className="text-gray-400 text-lg sm:text-xl 
            hover:text-yellow-400 hover:scale-110 active:scale-95 transition"
                        >
                            😊
                        </button>

                        <div
                            className={`absolute bottom-12 left-0 z-50 
            transition-all duration-200 origin-bottom
            ${showEmoji
                                    ? "opacity-100 scale-100 translate-y-0"
                                    : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                                }`}
                        >
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    </div>

                    {/* File Upload */}
                    <label className="cursor-pointer">
                        <CloudUploadIcon
                            className="text-gray-400 h-5 w-5 sm:h-6 sm:w-6
            hover:text-blue-500 hover:scale-110 active:scale-95 transition"
                            strokeWidth={2}
                        />
                        <input type="file" onChange={handleChangeFile} className="hidden" />
                    </label>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    className="flex-1 bg-gray-900/80 text-white rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base
        outline-none placeholder-gray-500 focus:ring-2 focus:ring-indigo-500
        transition-all"
                />

                {/* Send Button */}
                <button
                    onClick={sendMessage}
                    className="bg-linear-to-r from-indigo-500 to-pink-500 
        px-3 sm:px-4 py-2 rounded-full shadow-md 
        hover:scale-105 active:scale-95 transition 
        text-white flex items-center gap-1"
                >
                    <Check size={18} />
                    <span className="hidden sm:inline text-sm">Send</span>
                </button>

            </div>
        </div>
    );
}

export default ChatInput;
