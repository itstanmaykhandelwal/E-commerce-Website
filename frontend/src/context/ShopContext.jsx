import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [reviews, setReviews] = useState([]);

    // 🧩 NEW: currentUser state (JWT se nikal ke set karenge)
    const [currentUser, setCurrentUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();

    // 🧩 NEW: helper to decode JWT (base64url)
    const parseJwt = (tkn) => {
        try {
            const base = tkn.split('.')[1];
            const base64 = base.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    // FETCH PROFILE
    const fetchProfile = async (jwtToken = token) => {
        if (!jwtToken) {
            setProfile(null);
            setCurrentUser(null);
            return;
        }

        setProfileLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/profile`,
                {},
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );

            if (response.data.success) {
                const user = response.data.user;
                setProfile(user);
                setCurrentUser({ _id: user._id, name: user.name, email: user.email });
            } else {
                setProfile(null);
                setCurrentUser(null);
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
            setProfile(null);
            setCurrentUser(null);
        } finally {
            setProfileLoading(false);
        }
    };

    // Load token from localStorage once
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        if (localToken) {
            setToken(localToken);
            fetchProfile(localToken); // fetch profile immediately
        }
    }, []);

    // 🧩 NEW: whenever token changes, set currentUser from JWT
    useEffect(() => {
        if (token) {
            const payload = parseJwt(token);
            // NOTE: payload me id kis key pe aati hai ye tumhare backend JWT signing pe depend hai.
            // Common cases: payload.id, payload._id, payload.userId, payload.user?.id
            const uid =
                payload?.id ||
                payload?._id ||
                payload?.userId ||
                payload?.user?._id ||
                payload?.user?.id ||
                null;

            const name =
                payload?.name || payload?.user?.name || null;

            const email =
                payload?.email || payload?.user?.email || null;

            if (uid) {
                setCurrentUser({ _id: uid, name, email });
            } else {
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    }, [token]);

    const addToCart = async (itemId, size, color) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        if (!color) {
            toast.error('Select Product Color');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        if (!cartData[itemId][size]) {
            cartData[itemId][size] = {};
        }
        if (cartData[itemId][size][color]) {
            cartData[itemId][size][color] += 1;
        } else {
            cartData[itemId][size][color] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/add',
                    { itemId, size, color },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                for (const color in cartItems[itemId][size]) {
                    if (cartItems[itemId][size][color] > 0) {
                        totalCount += cartItems[itemId][size][color];
                    }
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, color, quantity) => {
        let cartData = structuredClone(cartItems);

        if (
            cartData[itemId] &&
            cartData[itemId][size] &&
            cartData[itemId][size][color] !== undefined
        ) {
            cartData[itemId][size][color] = quantity;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/update',
                    { itemId, size, color, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) continue;

            for (const size in cartItems[itemId]) {
                for (const color in cartItems[itemId][size]) {
                    let qty = cartItems[itemId][size][color];
                    if (qty > 0) {
                        totalAmount += itemInfo.price * qty;
                    }
                }
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const fetchWishlist = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${backendUrl}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) setWishlist(response.data.wishlist);
            else toast.error(response.data.message);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const addToWishlist = async (productId) => {
        if (!token) {
            toast.error("Please login first");
            return;
        }
        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/add`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setWishlist(response.data.wishlist);
                toast.success("Added to wishlist");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!token) {
            toast.error("Please login first");
            return;
        }
        try {
            const response = await axios.delete(
                `${backendUrl}/api/wishlist/remove/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setWishlist(response.data.wishlist);
                toast.success("Removed from wishlist");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    // ⭐ Reviews
    const fetchReviews = async (productId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/review/list`,
                { productId }
            );
            if (response.data.success) {
                setReviews(response.data.reviews);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const addReview = async (productId, rating, comment) => {
        if (!token) {
            toast.error("Please login to add review");
            return;
        }
        try {
            const response = await axios.post(
                `${backendUrl}/api/review/add`,
                { productId, rating, comment }, // userId backend auth se set hoga
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Review added successfully");
                fetchReviews(productId);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const updateReview = async (reviewId, productId, rating, comment) => {
        if (!token) {
            toast.error("Please login first");
            return;
        }
        try {
            const response = await axios.post(
                `${backendUrl}/api/review/update`,
                { id: reviewId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Review updated");
                fetchReviews(productId);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const removeReview = async (reviewId, productId) => {
        if (!token) {
            toast.error("Please login first");
            return;
        }
        try {
            const response = await axios.post(
                `${backendUrl}/api/review/remove`,
                { id: reviewId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Review removed");
                fetchReviews(productId);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };


    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
    }, []);

    useEffect(() => { if (token) fetchWishlist(); }, [token]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const newSocket = io(backendUrl); // backend ka URL
        setSocket(newSocket);

        newSocket.on("receive_message", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        return () => newSocket.disconnect();
    }, []);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        setShowSearch,
        showSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        wishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        reviews,
        fetchReviews,
        addReview,
        updateReview,
        removeReview,
        // 🧩 expose currentUser
        currentUser,
        profile,
        profileLoading,
        fetchProfile,
        chatMessages,
        socket,
        setChatMessages,

    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
