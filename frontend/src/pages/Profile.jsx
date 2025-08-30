import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
    const { profile, profileLoading } = useContext(ShopContext);

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

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                    {profile.name[0].toUpperCase()}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={() => alert("Edit profile clicked!")}
                >
                    Edit Profile
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Account Info</h3>
                <ul className="text-gray-700 space-y-1">
                    <li><strong>Name:</strong> {profile.name}</li>
                    <li><strong>Email:</strong> {profile.email}</li>
                    {/* Add more fields here if needed */}
                </ul>
            </div>
        </div>
    );
};

export default Profile;
