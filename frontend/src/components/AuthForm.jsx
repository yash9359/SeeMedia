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
            whileHover: { scale: 1.02, y: -1 },
            whileTap: { scale: 0.98, y: 0 },
            transition: { type: "spring", stiffness: 380, damping: 22, mass: 0.8 },
        };


    const renderLoginForm = () => (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
                <p className="text-gray-300 mt-1">Sign in to your account</p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handlerChange}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.email ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handlerChange}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.password ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => switchView("forgotPassword")}
                    className="text-sm text-blue-500 hover:text-blue-400"
                >
                    Forgot Password?
                </button>
            </div>

            <motion.button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-500 to-pink-500 py-3 rounded-xl font-semibold text-white transform-gpu"
                {...primaryButtonMotion}
            >
                Login
            </motion.button>

            <div className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className="text-blue-500 font-semibold"
                >
                    Register
                </button>
            </div>
        </div>
    );

    const renderRegisterForm = () => (
        <div className="w-full max-w-sm mx-auto relative space-y-6">
            <button
                type="button"
                onClick={() => switchView("login")}
                className="absolute top-1 left-0 text-gray-400 hover:text-white"
            >
                <ArrowLeft size={22} />
            </button>

            <div className="pt-6">
                <h2 className="text-3xl font-bold text-white">Create an Account</h2>
                <p className="text-gray-300 mt-1">
                    Join our community and connect with people
                </p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handlerChange}
                        autoComplete="username"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.username ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handlerChange}
                        autoComplete="email"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.email ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handlerChange}
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.password ? "border-red-500" : "border-gray-700"}`}
                    />
                </div>
            </div>

            <motion.button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-500 to-pink-500 py-3 rounded-xl font-semibold text-white transform-gpu"
                {...primaryButtonMotion}
            >
                Register
            </motion.button>

            <div className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="text-blue-500 font-semibold"
                >
                    Login
                </button>
            </div>
        </div>
    );

    const renderForgotPasswordForm = () => (
        <div className="w-full max-w-sm mx-auto relative space-y-6">
            <button
                type="button"
                onClick={() => switchView("login")}
                className="absolute top-1 left-0 text-gray-400 hover:text-white"
            >
                <ArrowLeft size={22} />
            </button>

            <div className="pt-6">
                <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
                <p className="text-gray-300 mt-1">
                    Enter your email to receive reset link
                </p>
            </div>

            <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handlerChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.email ? "border-red-500" : "border-gray-700"}`}
                />
            </div>

            <motion.button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-500 to-pink-500 py-3 rounded-xl font-semibold text-white transform-gpu"
                {...primaryButtonMotion}
            >
                Send Reset Link
            </motion.button>
        </div>
    );

    const renderPasswordChangeForm = () => (
        <>
            <button
                type="button"
                onClick={() => switchView("login")}
                className="absolute top-1 left-0 text-gray-400 hover:text-white"
            >
                <ArrowLeft size={22} />
            </button>

            <div className="w-full max-w-sm mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Password Change</h2>
                    <p className="text-gray-300 mt-1">Enter your new password bellow</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password(min 8 characters)"
                            value={formData.newPassword}
                            onChange={handlerChange}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.newPassword ? "border-red-500" : "border-gray-700"}`}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handlerChange}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
                    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#1f2937]
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    ${errors.confirmPassword ? "border-red-500" : "border-gray-700"}`}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => switchView("forgotPassword")}
                        className="text-sm text-blue-500 hover:text-blue-400"
                    >
                        Forgot Password?
                    </button>
                </div>

                <motion.button
                    type="submit"
                    className="w-full bg-linear-to-r from-indigo-500 to-pink-500 py-3 rounded-xl font-semibold text-white transform-gpu"
                    {...primaryButtonMotion}
                >
                    Change Password
                </motion.button>

                <div className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => switchView("signup")}
                        className="text-blue-500 font-semibold"
                    >
                        Register
                    </button>
                </div>
            </div>
        </>
    );

    const renderTokenError = () => (
        <>
            <div className="w-full max-w-sm mx-auto space-y-6">
                <div className="pt-6 ">
                    <h2 className="text-3xl font-bold text-white">
                        Invalid or Expired Link
                    </h2>
                    <p className="text-gray-300 mt-1">
                        This password reset link is invalid or has expired.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => switchView("forgotPassword")}
                    className="w-full p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                    Request New Reset Link
                </button>

                <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="w-full border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-50"
                >
                    Back to Login
                </button>
            </div>
        </>
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
                return token ? renderPasswordChangeForm() : renderTokenError();
            default:
                return renderLoginForm();
        }
    };

    return <form onSubmit={handleSubmit}>{renderForm()}</form>;
}

export default AuthForm;