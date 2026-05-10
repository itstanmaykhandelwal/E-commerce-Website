import { createContext, useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const data = await getProducts();

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                fetchProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
