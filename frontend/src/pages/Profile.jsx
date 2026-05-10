import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { FiUser, FiMail, FiLock, FiEdit2 } from "react-icons/fi";

import RippleButton from "../components/RippleButton";

// CUSTOM HOOK
import useAuth from "../hooks/useAuth";

// SERVICES
import { updateProfile, changePassword } from "../services/profileService";

const Profile = () => {
    // AUTH
    const { user, loading: authLoading, fetchUserProfile } = useAuth();

    // MODALS
    const [isEditModal, setIsEditModal] = useState(false);

    const [isPasswordModal, setIsPasswordModal] = useState(false);

    // FORM LOADING
    const [formLoading, setFormLoading] = useState(false);

    // STATES
    const [editData, setEditData] = useState({
        name: "",
        email: "",
    });

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    // PREFILL
    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    // INPUT CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // UPDATE PROFILE
    const handleUpdate = async () => {
        try {
            setFormLoading(true);

            const data = await updateProfile(editData);

            if (data.success) {
                toast.success("Profile updated successfully");

                await fetchUserProfile();

                setIsEditModal(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Failed to update profile",
            );
        } finally {
            setFormLoading(false);
        }
    };

    // CHANGE PASSWORD
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");

            return;
        }

        try {
            setFormLoading(true);

            const data = await changePassword({
                oldPassword,
                newPassword,
            });

            if (data.success) {
                toast.success("Password updated successfully");

                setIsPasswordModal(false);

                setOldPassword("");

                setNewPassword("");

                setConfirmPassword("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Failed to change password",
            );
        } finally {
            setFormLoading(false);
        }
    };

    // LOADING
    if (authLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center pt-[120px] bg-white">
                <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // NO USER
    if (!user) {
        return (
            <div className="min-h-screen flex justify-center items-center text-slate-500 text-lg pt-[120px] bg-white">
                Please login to view profile
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-[140px] px-4 pb-10">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

            {/* CARD */}
            <div className="relative max-w-md mx-auto bg-white shadow-xl rounded-3xl border border-gray-200 p-8">
                {/* PROFILE HEADER */}
                <div className="flex flex-col items-center">
                    {/* AVATAR */}
                    <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-5 border-4 border-slate-100">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>

                    {/* NAME */}
                    <h2 className="text-3xl font-bold text-[#1E3A5F] text-center">
                        {user.name}
                    </h2>

                    {/* EMAIL */}
                    <p className="text-slate-500 mt-2 text-center">
                        {user.email}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6 w-full">
                        <button
                            onClick={() => setIsEditModal(true)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl font-semibold shadow-md hover:scale-105 transition-all duration-300"
                        >
                            <FiEdit2 />
                            Edit Profile
                        </button>

                        <button
                            onClick={() => setIsPasswordModal(true)}
                            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:border-black hover:bg-slate-50 rounded-2xl font-semibold text-slate-800 transition-all duration-300"
                        >
                            <FiLock />
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">
                            Edit Profile
                        </h2>

                        <div className="space-y-5">
                            {/* NAME */}
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setIsEditModal(false)}
                                className="px-5 py-3 border border-gray-300 rounded-2xl hover:border-black hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                disabled={formLoading}
                                className="px-5 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl transition-all duration-300"
                            >
                                {formLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PASSWORD MODAL */}
            {isPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">
                            Change Password
                        </h2>

                        <div className="space-y-5">
                            {/* OLD PASSWORD */}
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    placeholder="Current Password"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>

                            {/* NEW PASSWORD */}
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="New Password"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm Password"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setIsPasswordModal(false)}
                                className="px-5 py-3 border border-gray-300 rounded-2xl hover:border-black hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handlePasswordChange}
                                disabled={formLoading}
                                className="px-5 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl transition-all duration-300"
                            >
                                {formLoading
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
