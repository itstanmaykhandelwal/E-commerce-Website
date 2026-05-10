import {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    loginUser,
    registerUser,
    getUserProfile,
} from "../services/authService";

export const AuthContext =
    createContext();

const AuthProvider = ({
    children,
}) => {

    // =========================
    // STATES
    // =========================

    const [token, setToken] =
        useState(
            localStorage.getItem(
                "token"
            ) || ""
        );

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [
        isAuthenticated,
        setIsAuthenticated,
    ] = useState(false);

    // =========================
    // LOGIN
    // =========================

    const login = async (
        formData
    ) => {

        try {

            setLoading(true);

            const data =
                await loginUser(
                    formData
                );

            if (
                data.success
            ) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                setToken(
                    data.token
                );

                setUser(
                    data.user
                );

                setIsAuthenticated(
                    true
                );

            }

            return data;

        } catch (error) {

            throw error;

        } finally {

            setLoading(
                false
            );

        }
    };

    // =========================
    // REGISTER
    // =========================

    const register =
        async (formData) => {

            try {

                setLoading(true);

                const data =
                    await registerUser(
                        formData
                    );

                if (
                    data.success
                ) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    setToken(
                        data.token
                    );

                    setUser(
                        data.user
                    );

                    setIsAuthenticated(
                        true
                    );

                }

                return data;

            } catch (error) {

                throw error;

            } finally {

                setLoading(
                    false
                );

            }
        };

    // =========================
    // FETCH PROFILE
    // =========================

    const fetchUserProfile =
        async () => {

            try {

                const storedToken =
                    localStorage.getItem(
                        "token"
                    );

                if (
                    !storedToken
                )
                    return;

                const data =
                    await getUserProfile();

                if (
                    data.success
                ) {

                    setUser(
                        data.user
                    );

                    setIsAuthenticated(
                        true
                    );

                }

            } catch (error) {

                console.log(
                    error
                );

                // DON'T FORCE LOGOUT
                // ON EVERY FAILURE

            }
        };

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        setToken("");

        setUser(null);

        setIsAuthenticated(
            false
        );
    };

    // =========================
    // RESTORE SESSION
    // =========================

    useEffect(() => {

        const storedToken =
            localStorage.getItem(
                "token"
            );

        if (
            storedToken
        ) {

            setToken(
                storedToken
            );

            fetchUserProfile();

        }

    }, []);

    return (
        <AuthContext.Provider
            value={{

                // STATES
                token,

                setToken,

                user,

                loading,

                isAuthenticated,

                // METHODS
                login,

                register,

                logout,

                fetchUserProfile,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};

export default AuthProvider;