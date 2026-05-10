import api from "../lib/axios";

// LOGIN
export const loginUser =
    async (formData) => {

        try {

            const response =
                await api.post(
                    "/api/user/login",
                    formData
                );

            return response.data;

        } catch (error) {

            throw error;

        }
    };

// REGISTER
export const registerUser =
    async (formData) => {

        try {

            const response =
                await api.post(
                    "/api/user/register",
                    formData
                );

            return response.data;

        } catch (error) {

            throw error;

        }
    };

// PROFILE
export const getUserProfile =
    async () => {

        try {

            const response =
                await api.post("/api/user/profile")

            return response.data;

        } catch (error) {

            throw error;

        }
    };