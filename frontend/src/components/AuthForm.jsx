import React from "react";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

function AuthForm({
    view,
    formData,
    errors,
    handlerChange,
    handleSubmit,
    switchView,
    token,
}) {
    const shouldReduceMotion = useReducedMotion();

    const primaryButtonMotion = shouldReduceMotion
        ? {}
        : {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 5 }, 
              transition: { type: "spring", stiffness: 400, damping: 18 },
          };

    const buttonClass =
        "w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg active:shadow-md";

    const iconClass =
        "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

    
    const ButtonWrapper = ({ children }) => (
        <div className="w-full overflow-hidden rounded-xl">
            {children}
        </div>
    );

    const renderLoginForm = () => (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">
                    Welcome Back!
                </h2>
                <p className="text-gray-300 mt-1">
                    Sign in to your account
                </p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Mail className={iconClass} size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handlerChange}
                        className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl 
                        focus:outline-none focus:ring-0 focus:border-indigo-500
                        ${errors.email ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>

                <div className="relative">
                    <Lock className={iconClass} size={20} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handlerChange}
                        className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl 
                        focus:outline-none focus:ring-0 focus:border-indigo-500
                        ${errors.password ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => switchView("forgotPassword")}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                    Forgot Password?
                </button>
            </div>

            <ButtonWrapper>
                <motion.button
                    type="submit"
                    className={buttonClass}
                    {...primaryButtonMotion}
                >
                    Login
                </motion.button>
            </ButtonWrapper>

            <div className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className="text-indigo-400 font-semibold"
                >
                    Register
                </button>
            </div>
        </div>
    );

    const renderRegisterForm = () => (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="inline-flex items-center text-gray-400 hover:text-white transition"
                >
                    <ArrowLeft size={22} />
                </button>
            </div>

            <div className="pt-6">
                <h2 className="text-3xl font-bold text-white">
                    Create an Account
                </h2>
                <p className="text-gray-300 mt-1">
                    Join our community and connect with people
                </p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <User className={iconClass} size={20} />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handlerChange}
                        className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl 
                        focus:outline-none focus:ring-0 focus:border-indigo-500
                        ${errors.username ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>

                <div className="relative">
                    <Mail className={iconClass} size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handlerChange}
                        className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl 
                        focus:outline-none focus:ring-0 focus:border-indigo-500
                        ${errors.email ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>

                <div className="relative">
                    <Lock className={iconClass} size={20} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handlerChange}
                        className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl 
                        focus:outline-none focus:ring-0 focus:border-indigo-500
                        ${errors.password ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>
            </div>

            <ButtonWrapper>
                <motion.button
                    type="submit"
                    className={buttonClass}
                    {...primaryButtonMotion}
                >
                    Register
                </motion.button>
            </ButtonWrapper>

            <div className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="text-indigo-400 font-semibold"
                >
                    Login
                </button>
            </div>
        </div>
    );

    const renderForgotPasswordForm = () => (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="inline-flex items-center text-gray-400 hover:text-white transition"
                >
                    <ArrowLeft size={22} />
                </button>
            </div>

            <div className="pt-6">
                <h2 className="text-3xl font-bold text-white">
                    Forgot Password
                </h2>
                <p className="text-gray-300 mt-1">
                    Enter your email to receive reset link
                </p>
            </div>

            <div className="relative">
                <Mail className={iconClass} size={20} />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handlerChange}
                    className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl
                    focus:outline-none focus:ring-0 focus:border-indigo-500
                    ${errors.email ? "border-red-500" : "border-gray-700"}`}
                />
            </div>

            <ButtonWrapper>
                <motion.button
                    type="submit"
                    className={buttonClass}
                    {...primaryButtonMotion}
                >
                    Send Reset Link
                </motion.button>
            </ButtonWrapper>
        </div>
    );

    const renderPasswordChangeForm = () => (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="inline-flex items-center text-gray-400 hover:text-white transition"
                >
                    <ArrowLeft size={22} />
                </button>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-white">
                    Password Change
                </h2>
                <p className="text-gray-300 mt-1">
                    Enter your new password
                </p>

                <div className="space-y-4 mt-4">
                    <div className="relative">
                        <Lock className={iconClass} size={20} />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handlerChange}
                            className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl
                            focus:outline-none focus:ring-0 focus:border-indigo-500
                            ${errors.newPassword ? "border-red-500" : "border-gray-700"}`}
                        />
                    </div>

                    <div className="relative">
                        <Lock className={iconClass} size={20} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handlerChange}
                            className={`auth-input w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl
                            focus:outline-none focus:ring-0 focus:border-indigo-500
                            ${errors.confirmPassword ? "border-red-500" : "border-gray-700"}`}
                        />
                    </div>
                </div>

                <ButtonWrapper>
                    <motion.button
                        type="submit"
                        className={buttonClass}
                        {...primaryButtonMotion}
                    >
                        Change Password
                    </motion.button>
                </ButtonWrapper>
            </div>
        </div>
    );

    const renderTokenError = () => (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="pt-6">
                <h2 className="text-3xl font-bold text-white">
                    Invalid or Expired Link
                </h2>
                <p className="text-gray-300 mt-1">
                    This password reset link is invalid or has expired.
                </p>
            </div>

            <ButtonWrapper>
                <motion.button
                    type="button"
                    onClick={() => switchView("forgotPassword")}
                    className={buttonClass}
                    {...primaryButtonMotion}
                >
                    Request New Reset Link
                </motion.button>
            </ButtonWrapper>

            <button
                type="button"
                onClick={() => switchView("login")}
                className="w-full border border-gray-600 text-gray-300 py-3 rounded-xl hover:bg-gray-800"
            >
                Back to Login
            </button>
        </div>
    );

    const renderForm = () => {
        switch (view) {
            case "login":
                return renderLoginForm();
            case "signup":
                return renderRegisterForm();
            case "forgotPassword":
                return renderForgotPasswordForm();
            case "passwordChange":
                return token
                    ? renderPasswordChangeForm()
                    : renderTokenError();
            default:
                return renderLoginForm();
        }
    };

    return <form onSubmit={handleSubmit}>{renderForm()}</form>;
}

export default AuthForm;