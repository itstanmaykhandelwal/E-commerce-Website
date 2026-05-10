import axios from "axios";

const api = axios.create({

    baseURL:
        import.meta.env
            .VITE_BACKEND_URL,

    headers: {
        "Content-Type":
            "application/json",
    },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        return Promise.reject(
            error
        );

    }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(

    (response) => response,

    (error) => {

        console.error(
            "API Error:",
            error?.response?.data ||
                error.message
        );

        if (
            error?.response
                ?.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

        }

        return Promise.reject(
            error
        );

    }
);

export default api;