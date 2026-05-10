import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import RippleButton from "../components/RippleButton";

import { FiMail, FiLock, FiUser } from "react-icons/fi";

// CUSTOM HOOK
import useAuth from "../hooks/useAuth";

const Login = () => {
    const [currentState, setCurrentState] = useState("Sign Up");

    // AUTH
    const { token, login, register } = useAuth();

    // FORM STATES
    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // SUBMIT HANDLER
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            let data;

            // REGISTER
            if (currentState === "Sign Up") {
                data = await register({
                    name,
                    email,
                    password,
                });
            } else {
                // LOGIN
                data = await login({
                    email,
                    password,
                });
            }

            if (data.success) {
                toast.success(
                    currentState === "Sign Up"
                        ? "Account created successfully"
                        : "Login successful",
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    };

    // REDIRECT
    useEffect(() => {
        if (token) {
            window.location.href = "/";
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-[120px] pb-10">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

            {/* CARD */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#1E3A5F]">
                        {currentState}
                    </h1>

                    <p className="text-slate-500 mt-3 leading-relaxed">
                        {currentState === "Login"
                            ? "Welcome back! Login to continue."
                            : "Create your account to start shopping."}
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={onSubmitHandler}
                    className="flex flex-col gap-5"
                >
                    {/* NAME */}
                    {currentState !== "Login" && (
                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                required
                            />
                        </div>
                    )}

                    {/* EMAIL */}
                    <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            required
                        />
                    </div>

                    {/* OPTIONS */}
                    <div className="flex justify-between items-center text-sm">
                        <button
                            type="button"
                            className="text-[#1E3A5F] hover:underline"
                        >
                            Forgot password?
                        </button>

                        {currentState === "Login" ? (
                            <p className="text-slate-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setCurrentState("Sign Up")}
                                    className="text-[#1E3A5F] font-semibold hover:underline"
                                >
                                    Sign Up
                                </button>
                            </p>
                        ) : (
                            <p className="text-slate-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setCurrentState("Login")}
                                    className="text-[#1E3A5F] font-semibold hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <div className="mt-3">
                        <RippleButton type="submit" disabled={loading}>
                            {loading
                                ? currentState === "Login"
                                    ? "Signing In..."
                                    : "Creating Account..."
                                : currentState === "Login"
                                  ? "Sign In"
                                  : "Create Account"}
                        </RippleButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
