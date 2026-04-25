import React, { useEffect, useState } from "react";
import AuthForm from "../components/AuthForm";
import logo from "../assets/finalPNGSeemedia.png";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const {user} = useSelector((state) => state.user);

  const [searchParams] = useSearchParams();
  const [view, setView] = useState("login");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  });



  const token = searchParams.get("token");
  

  useEffect(() => {
    if(token)
      setView("passwordChange");
  },[token])

  useEffect(() => {
    if(user)
      navigate("/");
  },[user, navigate])
  



  const handlerChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (view === "login") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!emailRegex.test(formData.email))
        newErrors.email = "Invalid email";

      if (!formData.password)
        newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    else if (view === "signup") {
      if (!formData.username)
        newErrors.username = "Username is required";

      if (!formData.email)
        newErrors.email = "Email is required";
      else if (!emailRegex.test(formData.email))
        newErrors.email = "Invalid email";

      if (!formData.password)
        newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    else if (view === "forgotPassword") {
      if (!formData.email)
        newErrors.email = "Email is required";
      else if (!emailRegex.test(formData.email))
        newErrors.email = "Invalid email";
    }

    else if (view === "passwordChange") {
      if (!formData.newPassword)
        newErrors.newPassword = "New Password is required";
      else if (formData.newPassword.length < 6)
        newErrors.newPassword = "Must be at least 6 characters";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm Password is required";
      else if (formData.confirmPassword !== formData.newPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return

    if (view == "signup") {
      dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }));
    }

    else if (view == "login") {
      dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      }));
    }
    else if (view == "forgotPassword") {
      //   dispatch(loginUser({
      //     email: formData.email,
      //   }));
    }
    // else if (view == "passwordChange") {
    // }

    // Clear Form after submit

    setFormData({

      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",

    })




  };

  const switchView = (newView) => {
    setView(newView);
    setErrors({});
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    });
  };

  const sidePanelTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 110, damping: 20, mass: 0.85 };

  const formTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 260, damping: 26, mass: 0.9 };

  const logoIntroTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 140, damping: 16, mass: 0.8, delay: 0.08 };

  return (
   <div className="bg-black/95 text-white min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">

  <div className="relative w-full max-w-xl md:max-w-3xl lg:max-w-4xl 
  backdrop-blur-2xl bg-white/5 border border-white/10 
  p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] 
  flex flex-col md:flex-row items-center overflow-hidden">

    {/* left side */}
  <motion.div
  initial={false}
  animate={{ opacity: 1, y: 0 }}
  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
  className="hidden md:flex md:w-1/2 p-8 h-full items-center justify-center relative will-change-transform opacity-0"
  style={{ transform: "translateY(30px)" }}
>

  {/* background */}
  <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-90 z-0"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center text-center p-4">

    {/* logo reveal */}
    <motion.div
      initial={shouldReduceMotion ? false : { scale: 0.86, opacity: 0, y: 26, rotate: -6 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
      transition={logoIntroTransition}
      className="relative w-52 md:w-64 lg:w-72 mb-5"
    >
      <motion.div
        aria-hidden="true"
        className="absolute -inset-4 rounded-full bg-white/20 blur-2xl"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={shouldReduceMotion ? { opacity: 0.35 } : { opacity: [0.2, 0.45, 0.2] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-white/30"
        initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
        animate={shouldReduceMotion ? { scale: 1, opacity: 0.25 } : { scale: [0.94, 1.06, 0.94], opacity: [0.2, 0.45, 0.2] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src={logo}
        alt="SeeMedia logo"
        className="relative z-10 w-full h-auto object-contain drop-shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
        animate={
          shouldReduceMotion
            ? { y: 0, rotate: 0 }
            : { y: [0, -8, 0], rotate: [0, -1.2, 0, 1.2, 0] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </motion.div>

    {/* text */}
    <motion.h1
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.34, delay: 0.18, ease: "easeOut" }}
      className="text-3xl font-extrabold text-white mb-3 tracking-wide"
    >
      Connect with Friends
    </motion.h1>

    <motion.p
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.36, delay: 0.24, ease: "easeOut" }}
      className="text-gray-200 text-base md:text-lg font-light leading-relaxed"
    >
      Discover, share and connect with people all over the world.
    </motion.p>

  </div>
</motion.div>

    {/* right side */}
    <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">

      <motion.div layout className="w-full relative overflow-hidden transform-gpu">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            layout
            initial={shouldReduceMotion ? false : { opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, x: -14 }}
            transition={formTransition}
            className="w-full will-change-transform"
          >
            <AuthForm
              view={view}
              formData={formData}
              errors={errors}
              handlerChange={handlerChange}
              handleSubmit={handleSubmit}
              switchView={switchView}
              token={token}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </div>

  </div>
</div>
  );
}

export default Login;