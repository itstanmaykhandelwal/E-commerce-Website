import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [wishlist, setWishlist] = useState([]);

    // const [cartItems, setCartItems] = useState({});
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const [products, setProducts] = useState([])
    const [token, setToken] = useState("")
    const navigate = useNavigate();

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
                    { itemId, size, color }, // <- yaha color bhi bhejna zaroori hai
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

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
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

    // Add to wishlist
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

    // Remove from wishlist
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
    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])
    useEffect(() => { if (token) fetchWishlist(); }, [token]);
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);
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
        removeFromWishlist
    };
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider