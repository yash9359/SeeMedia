import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useSelector } from "react-redux";
import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import defaultProfile from "../assets/defaultProfile.jpg";

function AccountEdit() {
    const { user, loading } = useSelector((state) => state.user);

    const [profileData, setProfileData] = useState({
        username: "",
        name: "",
        website: "",
        bio: "",
        email: "",
        phone: "",
    });

    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || "",
                name: user.name || "",
                website: user.website || "",
                bio: user.bio || "",
                email: user.email || "",
                phone: user.phone || "",
            });
            setProfileImage(user?.profileImage || null);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Updating profile...");

        try {
            const { data } = await axiosInstance.put(
                "/users/update-profile",
                profileData
            );

            if (data?.success) {
                toast.success(data?.message || "Profile updated Successfully ", {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Profile Update failed ",
                { id: toastId }
            );
        }
    };

    const handleImageChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            setProfileImage(URL.createObjectURL(file));

            const formData = new FormData();
            formData.append("profileImage", file);

            const toastId = toast.loading("Uploading image...");

            const { data } = await axiosInstance.post(
                "/users/upload-profile",
                formData
            );

            if (data?.success) {
                toast.success("Profile image updated Successfully", { id: toastId });
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Profile image upload failed "
            );
        }
    };

    if (loading)
        return (
            <div className="text-white flex justify-center items-center h-screen">
                Loading...
            </div>
        );

    return (
        <div className="bg-linear-to-br from-black via-zinc-900 to-black text-white min-h-screen flex">
            <Sidebar />

            <main className="flex-1 flex justify-center items-start py-10 px-4">
                <div className="w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">

                    {/* HEADER */}
                    <header className="flex items-center justify-between mb-8">
                        <Link
                            to={`/profile/${user?._id}`}
                            className="p-2 rounded-full hover:bg-white/10 transition"
                        >
                            <ArrowLeft className="w-6 h-6 hover:-translate-x-1 transition" />
                        </Link>

                        <h1 className="text-xl font-semibold tracking-wide">
                            Edit Profile
                        </h1>

                        <button
                            onClick={handleSave}
                            className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95 transition rounded-lg text-sm font-semibold shadow-md"
                        >
                            Save
                        </button>
                    </header>

                    {/* Profile Image */}
                    <section className="flex flex-col items-center mb-10">
                        <div className="relative group">
                            <img
                                src={profileImage || defaultProfile}
                                alt="profile"
                                className="w-28 h-28 rounded-full object-cover border border-gray-600 shadow-md transition group-hover:scale-105"
                            />

                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full text-xs cursor-pointer transition">
                                Change
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        <p className="mt-3 text-xs text-gray-400">
                            Tap to change profile picture
                        </p>
                    </section>

                    {/* FORM */}
                    <div className="space-y-6">
                        {["name", "username", "website", "bio", "email", "phone"].map(
                            (field) => (
                                <div key={field} className="relative">

                                    {/* FLOATING LABEL */}
                                    <label className="absolute left-3 -top-2 text-xs px-1 bg-black text-gray-400 capitalize">
                                        {field}
                                    </label>

                                    {field === "bio" ? (
                                        <textarea
                                            name={field}
                                            value={profileData[field]}
                                            onChange={handleChange}
                                            placeholder={`Enter your ${field}`}
                                            className="w-full bg-white/5 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-3 text-sm outline-none resize-none h-24 transition"
                                        />
                                    ) : (
                                        <input
                                            type={
                                                field === "email"
                                                    ? "email"
                                                    : field === "phone"
                                                        ? "tel"
                                                        : "text"
                                            }
                                            name={field}
                                            value={profileData[field]}
                                            onChange={handleChange}
                                            placeholder={`Enter your ${field}`}
                                            className="w-full bg-white/5 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-3 text-sm outline-none transition"
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AccountEdit;