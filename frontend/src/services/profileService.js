import api from "../lib/axios";

// ==========================
// GET PROFILE
// ==========================

export const getProfile = async () => {
    try {
        const response = await api.post("/api/user/profile");

        return response.data;
    } catch (error) {
        console.log(error);

        throw error.response?.data || error.message;
    }
};

// ==========================
// UPDATE PROFILE
// ==========================

export const updateProfile = async (profileData) => {
    try {
        const response = await api.post("/api/user/update", profileData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error.response?.data || error.message;
    }
};

// ==========================
// CHANGE PASSWORD
// ==========================

export const changePassword = async (passwordData) => {
    try {
        const response = await api.post(
            "/api/user/change-password",
            passwordData,
        );

        return response.data;
    } catch (error) {
        console.log(error);

        throw error.response?.data || error.message;
    }
};

// ==========================
// GET USERS (ADMIN)
// ==========================

export const getUsers = async () => {
    try {
        const response = await api.get("/api/user/list");

        return response.data;
    } catch (error) {
        console.log(error);

        throw error.response?.data || error.message;
    }
};

// ==========================
// UPDATE USER ROLE
// ==========================

export const updateUserRole = async (userData) => {
    try {
        const response = await api.post("/api/user/update-role", userData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error.response?.data || error.message;
    }
};
