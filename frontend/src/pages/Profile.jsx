import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import RippleButton from "../components/RippleButton";

const Profile = () => {
    const { profile, profileLoading, backendUrl, token, fetchProfile } =
        useContext(ShopContext);

    const [isEditModal, setIsEditModal] = useState(false);
    const [isPasswordModal, setIsPasswordModal] = useState(false);

    const [editData, setEditData] = useState({ name: "", email: "" });
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Loading UI
    if (profileLoading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );

    if (!profile)
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
                Please login to view profile
            </div>
        );

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    // Update profile
    const handleUpdate = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/update`,
                { name: editData.name, email: editData.email },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully");
                fetchProfile();
                setIsEditModal(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    // Change password
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/user/change-password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Password updated successfully");
                setIsPasswordModal(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                    {profile.name[0].toUpperCase()}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <div className="flex gap-3">
                    <RippleButton
                        onClick={() => {
                            setEditData({
                                name: profile.name,
                                email: profile.email,
                            });
                            setIsEditModal(true);
                        }}
                    >
                        Edit Profile
                    </RippleButton>
                    <RippleButton
                        onClick={() => setIsPasswordModal(true)}
                    >
                        Change Password
                    </RippleButton>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Account Info</h3>
                <ul className="text-gray-700 space-y-1">
                    <li>
                        <strong>Name:</strong> {profile.name}
                    </li>
                    <li>
                        <strong>Email:</strong> {profile.email}
                    </li>
                </ul>
            </div>

            {/* 🔹 Edit Profile Modal */}
            {isEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                        <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                            placeholder="Email"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <RippleButton
                                onClick={handleUpdate}
                            >
                                Save
                            </RippleButton>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Change Password Modal */}
            {isPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Change Password
                        </h2>

                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                            placeholder="Old Password"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                            placeholder="New Password"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                            placeholder="Confirm New Password"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsPasswordModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <RippleButton
                                onClick={handlePasswordChange}
                            >
                                Update
                            </RippleButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
