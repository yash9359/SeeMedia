import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { axiosInstance } from "@/lib/axios";
import { getAllStories } from "@/redux/slices/storiesSlice";
import { useDispatch } from "react-redux";
import { ImageIcon, Pause, Play, Upload, VideoIcon, Volume, Volume2, VolumeX, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllReels } from "@/redux/slices/reelSlice";

function CreateMedia({ type = "post", onSuccess }) {



  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [currentType, setCurrentType] = useState(type);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  //for drag and drop
  const [isDraging, setIsDraging] = useState(false);

  // video ko play kar ke bhi dekh sakte hai agar hoga to
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    // use effect is liye taki jab type change ho jaye too like video to image to sare state khali ho jaye bss simple

    setFile(null);
    setCaption("");
    setPreviewUrl(null);
    setUploading(false);
    setProgress(0);
    setError(null);
    setIsPlaying(false);
    setIsMuted(false);
  }, [currentType]);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  // when you direct select the file ladle
  const handleFileChange = (e) => handleFileSelect(e.target.files[0]);

  // for drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleClickDropArea = () => fileInputRef.current?.click();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return setError("Please select a file.");

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // image video ko isi method se dalte hai
      const formData = new FormData();

      // media name same hona cahiye clodunary ke media folder mai jayega na
      formData.append("media", file);

      if (currentType !== "story") {
        formData.append("caption", caption);
      }
      formData.append(
        "mediaType",
        file.type.startsWith("video/") ? "video" : "image",
      );

      const apiEndpoint =
        currentType === "story"
          ? `/stories/create`
          : currentType === "post"
            ? `/posts/create`
            : `/reels/create`;

      const { data } = await axiosInstance.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },

        onUploadProgress: (progressEvent) =>
          setProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          ),
      });

      if (data.success) {
        currentType === "story"
          ? dispatch(getAllStories())
          : currentType === "reel"
            ? dispatch(getAllReels())
            : "";
        setFile(null);
        setCaption("");
        setPreviewUrl(null);
        setUploading(false);
        setProgress(0);
        setError(null);
        setIsPlaying(false);
        setIsMuted(false);
        if (fileInputRef.current) fileInputRef.current.value = null

        toast.success(`${currentType === "story" ? "Story" : currentType === "post" ? "Post" : "Reel"} created successfully! 🎉`)

        onSuccess && onSuccess();
      } else {
        setError(data?.message || "Upload Failed")
        toast.error(`${currentType === "story" ? "Story" : currentType === "post" ? "Post" : "Reel"} creation failed. Please try again.`)
      }


    } catch (error) {
      console.log("Error :", error);
      setError(error?.message || "Upload Failed")
      toast.error(`${currentType === "story" ? "Story" : currentType === "post" ? "Post" : "Reel"} creation failed. Please try again.`)
    } finally {
      setUploading(false);
    }
  };

  const titleMap = { story: "Create a New Story", post: "Create a New Post", reel: "Create a New Reel" }
  const buttonMap = { story: "Upload Story", post: "Upload New Post", reel: "Upload Reel" }



  return (
    <div className="flex w-full flex-col items-center gap-4 p-5">
      <div className="flex  flex-col items-center gap-2 w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {titleMap[currentType]}
        </h2>
        {type !== "story" &&
          <div className="flex gap-4 w-full ">
            <button type="button" className={`px-4 w-full py-2 rounded ${currentType === "post" ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-700 to-gray-300'}`} onClick={() => setCurrentType('post')}>Post</button>

            <button type="button" className={`px-4 w-full py-2 rounded ${currentType === "reel" ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-700 to-gray-300'}`} onClick={() => setCurrentType('reel')}>Reel</button>

          </div>
        }
      </div>

      <form onSubmit={handleUpload} className="space-y-5 w-full">

        {!previewUrl ? (<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={handleClickDropArea} onDrop={handleDrop} className={`w-full max-h-80 h-44 p-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${isDraging ? 'border-purple-500 bg-purple-900/30' : 'border-gray-500 hover:border-purple-400'}`}>

          <div className="flex flex-col items-center text-gray-400 space-y-2">
            <Upload size={36} className="text-purple-400 " />
            <p className="text-center">{isDraging ? "Drop your file here..." : 'Click or  Drag & Drop file...'}</p>

            <div className="flex items-center gap-6 mt-2">
              <div className="flex flex-col items-center"><ImageIcon size={28} className="text-green-400" />
                <span className="text-xs">Image</span>
              </div>

              <div className="flex flex-col items-center"><VideoIcon size={28} className="text-green-400" />
                <span className="text-xs">Video</span>
              </div>
            </div>
          </div>

        </div>
        )

          :

          (
            <div className="w-full max-h-80 h-44 relative flex items-center justify-center rounded-xl overflow-hidden bg-gray-900/30">
              {file.type.startsWith("video/") ?

                <>
                  <video ref={videoInputRef} src={previewUrl} onEnded={() => setIsPlaying(false)} className="max-w-full max-h-full object-contain rounded-xl" />
                  <div className="absolute bottom-2 left-2 flex gap-2 bg-black/50 p-1 rounded">
                    <button type="button" onClick={() => {

                      if (!videoInputRef.current) return;
                      if (isPlaying) {
                        videoInputRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        videoInputRef.current.play();
                        setIsPlaying(true);
                      }


                    }} className="text-white p-1">{isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        videoInputRef.current.muted = !videoInputRef.current.muted;
                        setIsMuted(videoInputRef.current.muted);
                      }}
                      className="text-white p-1"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </>
                :
                <><img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl" />

                </>
              }
              <button type="button" onClick={() => {
                setFile(null);
                setPreviewUrl("");
                setIsMuted(false);
                setIsPlaying(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = null
                }
              }} className="absolute text-center top-2 right-2 bg-white/20 hover:bg-white/30 text-white rounded-full w-7 h-7 flex items-center justify-center backdrop-blur-md transition"
              >
                ✕
              </button>
            </div>
          )


        }

        <input type="file" accept="image/*, video/*" onChange={handleFileChange} ref={fileInputRef} className="hidder" />
        {currentType !== "story" && <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption..." className="w-full px-3 py-2 rounded-lg bg-gray-800 outline-none text-white" />}

        {uploading && <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="bg-linear-to-r from-purple-500 to-pink-500 h-2 transition-all duration-200 " style={{ width: `${progress}%` }}></div>
        </div>
        }
        {<p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" disabled={uploading || !file} className="w-full rounded-full bg-linear-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed p-2 py-3">{uploading ? "Uploading... " : buttonMap[currentType]}</button>


      </form>

    </div>
  )
}

export default CreateMedia;
