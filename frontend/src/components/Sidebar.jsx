import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  MonitorPlay,
  Search,
  User,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/finalPNGSeemedia.png";
import { logoutUser } from "@/redux/slices/userSlice";
import Modal from "./Modal";
import CreateMedia from "./CreateMedia";
import { useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { user: currentUser } = useSelector((state) => state.user);
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "Home", icon: <Home size={22} />, id: "home", link: "/" },
    {
      name: "Explore",
      icon: <Search size={22} />,
      id: "search",
      link: "/explore",
    },
    {
      name: "Reels",
      icon: <MonitorPlay size={22} />,
      id: "reels",
      link: "/reels",
    },
    {
      name: "Message",
      icon: <MessageCircle size={22} />,
      id: "message",
      link: "/chats",
    },
    {
      name: "Profile",
      icon: <User size={22} />,
      id: "profile",
      link: `/profile/${currentUser?._id}`,
    },
    { name: "Logout", icon: <LogOut size={22} />, id: "logout" },
  ];

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [mediaType, setMediaType] = useState(null);

  const handleOpenModel = (type) => {
    setOpenCreateModal(true);
    setMediaType(type);
  };

  return (
    <>
      <aside
        className="sticky top-0 left-0 h-screen w-20 md:w-64 p-3 md:p-4 flex flex-col gap-4 md:gap-6 
  border-r border-white/10 backdrop-blur-2xl bg-white/5 
  shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        {/* logo */}
        <Link to="/" className="flex items-center justify-center w-full">
          {/* Desktop Logo */}
          <img
            src={
              logo ||
              "https://res.cloudinary.com/dthsimdfz/image/upload/v1775485285/finalPNGSeemedia_atidsc.webp"
            }
            alt="logo"
            className={`hidden md:block w-full max-w-40 lg:max-w-47.5 
              h-auto object-contain mx-auto 
              transition-all duration-500 
              hover:scale-105 
              ${isHome ? "animate-[fadeIn_0.6s_ease-out]" : ""} 
              drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]`}
          />

          {/* Mobile Logo */}
          <img
            src={
              logo ||
              "https://res.cloudinary.com/dthsimdfz/image/upload/v1775485285/finalPNGSeemedia_atidsc.webp"
            }
            alt="logo"
            className={`block md:hidden w-10 h-10 object-contain mx-auto 
              transition-all duration-300 hover:scale-110
              ${isHome ? "animate-[fadeIn_0.6s_ease-out]" : ""}
              drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]`}
          />


          
        </Link>

        {/* nav items */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) =>
            item.id === "logout" ? (
              <button
                key={item.id}
                onClick={() => dispatch(logoutUser(navigate))}
                className="w-full flex items-center justify-start gap-3 p-2 px-3 rounded-xl 
            transition-all duration-300 
            hover:bg-linear-to-r hover:from-pink-500/20 hover:to-purple-500/20
            hover:scale-[1.02] active:scale-95"
              >
                {item.icon}
                <span className="hidden md:inline font-medium text-sm text-gray-300">
                  {item.name}
                </span>
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.link}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center justify-start gap-3 p-2 px-3 rounded-xl 
            transition-all duration-300 
            hover:bg-linear-to-r hover:from-pink-500/20 hover:to-purple-500/20
            hover:scale-[1.02] active:scale-95
            ${active === item.id
                    ? "bg-linear-to-r from-pink-500/30 to-purple-500/30 shadow-md"
                    : ""
                  }`}
              >
                {item.icon}
                <span className="hidden md:inline font-medium text-sm text-gray-300">
                  {item.name}
                </span>
              </Link>
            ),
          )}

          {/* notification */}
          <div
            className="w-full flex items-center justify-start gap-3 p-2 px-3 rounded-xl 
      transition-all duration-300 
      hover:bg-linear-to-r hover:from-pink-500/20 hover:to-purple-500/20"
          >
            <NotificationBell />
            <span className="hidden md:inline font-medium text-sm text-gray-300">
              Notification
            </span>
          </div>
        </nav>

        {/* create button */}
        <button
          onClick={() => handleOpenModel("post")}
          className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-2.5 md:py-3 rounded-xl 
      font-semibold text-white 
      bg-linear-to-r from-indigo-500 to-pink-500 
      transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} className="shrink-0" />
          <span className="hidden md:inline">Create</span>
        </button>
      </aside>

      <Modal
        openModal={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        initialWidth="max-w-2xl"
        initialHeight="h-auto"
      >
        <CreateMedia
          type={mediaType}
          onSuccess={() => setOpenCreateModal(false)}
        />
      </Modal>
    </>
  );
}

export default Sidebar;
