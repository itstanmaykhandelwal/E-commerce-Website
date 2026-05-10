import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { assets } from "../assets/assets";

// CUSTOM HOOK
import useSearch from "../hooks/useSearch";

const SearchBar = () => {
    // SEARCH CONTEXT
    const { search, setSearch, showSearch, setShowSearch } = useSearch();

    const [visible, setVisible] = useState(false);

    const location = useLocation();

    // SHOW SEARCH ONLY ON COLLECTION PAGE
    useEffect(() => {
        if (location.pathname.includes("collection")) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    // HIDE SEARCH WHEN PAGE CHANGES
    useEffect(() => {
        if (!location.pathname.includes("collection")) {
            setShowSearch(false);
        }
    }, [location]);

    return showSearch && visible ? (
        <div className="border-t border-b border-gray-200 bg-white text-center mt-[100px] shadow-sm">
            <div className="inline-flex items-center justify-center bg-white border border-gray-300 px-5 py-3 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 shadow-sm">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400"
                    type="text"
                    placeholder="Search products..."
                />

                <img
                    className="w-4 opacity-70"
                    src={assets.search_icon}
                    alt="search"
                />
            </div>

            <img
                onClick={() => setShowSearch(false)}
                className="inline w-3 cursor-pointer opacity-60 hover:opacity-100 transition mb-1"
                src={assets.cross_icon}
                alt="cross"
            />
        </div>
    ) : null;
};

export default SearchBar;
