import api from "../lib/axios";

// =========================
// SUBMIT CONTACT FORM
// =========================

export const submitContactForm =
    async (formData) => {

        try {

            const response =
                await api.post(
                    "/api/contact/add",
                    formData
                );

            return response.data;

        } catch (error) {

            console.log(
                error
            );

            throw error;

        }
    };

// =========================
// GET ALL CONTACTS
// =========================

export const getAllContactMessages =
    async () => {

        try {

            const response =
                await api.get(
                    "/api/contact/list"
                );

            return response.data;

        } catch (error) {

            console.log(
                error
            );

            throw error;

        }
    };

// =========================
// DELETE CONTACT
// =========================

export const deleteContactMessage =
    async (id) => {

        try {

            const response =
                await api.delete(
                    `/api/contact/delete/${id}`
                );

            return response.data;

        } catch (error) {

            console.log(
                error
            );

            throw error;

        }
    };