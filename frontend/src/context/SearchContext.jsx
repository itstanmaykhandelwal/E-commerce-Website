import { createContext, useState } from "react";

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    // SEARCH TEXT
    const [search, setSearch] = useState("");

    // SEARCH VISIBILITY
    const [showSearch, setShowSearch] = useState(false);

    return (
        <SearchContext.Provider
            value={{
                search,
                setSearch,
                showSearch,
                setShowSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;
