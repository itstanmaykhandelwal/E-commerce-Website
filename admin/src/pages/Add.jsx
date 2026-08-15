import axios from "axios";
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
    // =========================
    // EDIT MODE
    // =========================

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // =========================
    // IMAGES
    // =========================

    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    // Existing image previews
    const [existingImages, setExistingImages] = useState([]);

    // =========================
    // PRODUCT DATA
    // =========================

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [color, setColor] = useState([]);

    // =========================
    // CHECK EDIT MODE
    // =========================

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const id = params.get("edit");

        if (id) {
            setEditId(id);
            fetchProduct(id);
        }
    }, []);

    // =========================
    // FETCH PRODUCT
    // =========================

    const fetchProduct = async (id) => {
        try {
            setLoading(true);

            const response = await axios.post(
                backendUrl + "/api/product/single",
                {
                    productId: id,
                },
            );

            if (response.data.success) {
                const product = response.data.product;

                setName(product.name || "");
                setDescription(product.description || "");
                setPrice(product.price || "");
                setQuantity(product.quantity ?? "");

                setCategory(product.category || "Men");

                setSubCategory(product.subCategory || "Topwear");

                setBestseller(product.bestseller || false);

                setSizes(product.sizes || []);
                setColor(product.color || []);

                setExistingImages(product.image || []);
            } else {
                toast.error(response.data.message || "Unable to load product");
            }
        } catch (error) {
            console.log("Fetch Product Error:", error);

            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // SUBMIT
    // =========================

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("quantity", quantity);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("color", JSON.stringify(color));

            // Product ID only in edit mode
            if (editId) {
                formData.append("id", editId);
            }

            // New images are optional during edit
            if (image1) {
                formData.append("image1", image1);
            }

            if (image2) {
                formData.append("image2", image2);
            }

            if (image3) {
                formData.append("image3", image3);
            }

            if (image4) {
                formData.append("image4", image4);
            }

            // =========================
            // ADD / UPDATE API
            // =========================

            const endpoint = editId
                ? "/api/product/update"
                : "/api/product/add";

            const response = await axios.post(backendUrl + endpoint, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);

                // If edit mode, go back to list
                if (editId) {
                    window.location.href = "/list";
                    return;
                }

                // Reset Add form
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log("Product Submit Error:", error);

            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");

        setCategory("Men");
        setSubCategory("Topwear");

        setBestseller(false);

        setSizes([]);
        setColor([]);

        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);

        setExistingImages([]);
    };

    // =========================
    // TOGGLE SIZE
    // =========================

    const toggleSize = (size) => {
        setSizes((prev) =>
            prev.includes(size)
                ? prev.filter((item) => item !== size)
                : [...prev, size],
        );
    };

    // =========================
    // TOGGLE COLOR
    // =========================

    const toggleColor = (clr) => {
        setColor((prev) =>
            prev.includes(clr)
                ? prev.filter((item) => item !== clr)
                : [...prev, clr],
        );
    };

    // =========================
    // UI
    // =========================

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col w-full items-start gap-3"
        >
            {/* TITLE */}

            <h2 className="text-xl font-semibold mb-2">
                {editId ? "Edit Product" : "Add Product"}
            </h2>

            {/* =========================
                EXISTING IMAGES
            ========================= */}

            {editId && existingImages.length > 0 && (
                <div>
                    <p className="mb-2">Current Images</p>

                    <div className="flex gap-2">
                        {existingImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                className="w-20 h-20 object-cover border"
                                alt={`product-${index}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* =========================
                NEW IMAGES
            ========================= */}

            <div>
                <p className="mb-2">
                    {editId ? "Upload New Images (Optional)" : "Upload Image"}
                </p>

                <div className="flex gap-2">
                    {/* IMAGE 1 */}

                    <label htmlFor="image1">
                        <img
                            className="w-20 h-20 object-cover"
                            src={
                                !image1
                                    ? assets.upload_area
                                    : URL.createObjectURL(image1)
                            }
                            alt="add-img"
                        />

                        <input
                            onChange={(e) => setImage1(e.target.files[0])}
                            type="file"
                            id="image1"
                            accept="image/*"
                            hidden
                        />
                    </label>

                    {/* IMAGE 2 */}

                    <label htmlFor="image2">
                        <img
                            className="w-20 h-20 object-cover"
                            src={
                                !image2
                                    ? assets.upload_area
                                    : URL.createObjectURL(image2)
                            }
                            alt="add-img"
                        />

                        <input
                            onChange={(e) => setImage2(e.target.files[0])}
                            type="file"
                            id="image2"
                            accept="image/*"
                            hidden
                        />
                    </label>

                    {/* IMAGE 3 */}

                    <label htmlFor="image3">
                        <img
                            className="w-20 h-20 object-cover"
                            src={
                                !image3
                                    ? assets.upload_area
                                    : URL.createObjectURL(image3)
                            }
                            alt="add-img"
                        />

                        <input
                            onChange={(e) => setImage3(e.target.files[0])}
                            type="file"
                            id="image3"
                            accept="image/*"
                            hidden
                        />
                    </label>

                    {/* IMAGE 4 */}

                    <label htmlFor="image4">
                        <img
                            className="w-20 h-20 object-cover"
                            src={
                                !image4
                                    ? assets.upload_area
                                    : URL.createObjectURL(image4)
                            }
                            alt="add-img"
                        />

                        <input
                            onChange={(e) => setImage4(e.target.files[0])}
                            type="file"
                            id="image4"
                            accept="image/*"
                            hidden
                        />
                    </label>
                </div>
            </div>

            {/* =========================
                NAME
            ========================= */}

            <div className="w-full">
                <p className="mb-2">Product name</p>

                <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full max-w-[500px] px-3 py-2 border"
                    type="text"
                    placeholder="Type here"
                    required
                />
            </div>

            {/* =========================
                DESCRIPTION
            ========================= */}

            <div className="w-full">
                <p className="mb-2">Product description</p>

                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full max-w-[500px] px-3 py-2 border"
                    placeholder="Write content here"
                    required
                />
            </div>

            {/* =========================
                CATEGORY / PRICE / STOCK
            ========================= */}

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                    <p className="mb-2">Product category</p>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border"
                    >
                        <option value="Men">Men</option>

                        <option value="Women">Women</option>

                        <option value="Kids">Kids</option>
                    </select>
                </div>

                <div>
                    <p className="mb-2">Sub category</p>

                    <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full px-3 py-2 border"
                    >
                        <option value="Topwear">Topwear</option>

                        <option value="Bottomwear">Bottomwear</option>

                        <option value="Winterwear">Winterwear</option>
                    </select>
                </div>

                <div>
                    <p className="mb-2">Product Price</p>

                    <input
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className="w-full px-3 py-2 sm:w-[120px] border"
                        type="number"
                        min="0"
                        placeholder="25"
                        required
                    />
                </div>

                <div>
                    <p className="mb-2">Total Products</p>

                    <input
                        onChange={(e) => setQuantity(e.target.value)}
                        value={quantity}
                        className="w-full px-3 py-2 sm:w-[140px] border"
                        type="number"
                        min="0"
                        placeholder="10"
                        required
                    />
                </div>
            </div>

            {/* =========================
                SIZES
            ========================= */}

            <div>
                <p className="mb-2">Product Sizes</p>

                <div className="flex gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <div key={size} onClick={() => toggleSize(size)}>
                            <p
                                className={`${
                                    sizes.includes(size)
                                        ? "bg-pink-100 border-pink-500"
                                        : "bg-slate-200 border-gray-300"
                                } px-3 py-1 cursor-pointer border`}
                            >
                                {size}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* =========================
                COLORS
            ========================= */}

            <div>
                <p className="mb-2 mt-4">Product Colors</p>

                <div className="flex gap-3 flex-wrap">
                    {[
                        "Red",
                        "Green",
                        "Blue",
                        "Black",
                        "White",
                        "Yellow",
                        "Pink",
                        "Purple",
                        "Brown",
                        "Grey",
                    ].map((clr) => (
                        <div key={clr} onClick={() => toggleColor(clr)}>
                            <p
                                className={`px-4 py-1 cursor-pointer rounded border ${
                                    color.includes(clr)
                                        ? "bg-blue-200 border-blue-500"
                                        : "bg-slate-200 border-gray-300"
                                }`}
                            >
                                {clr}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* =========================
                BESTSELLER
            ========================= */}

            <div className="flex gap-2 mt-2">
                <input
                    onChange={() => setBestseller((prev) => !prev)}
                    checked={bestseller}
                    type="checkbox"
                    id="bestseller"
                />

                <label className="cursor-pointer" htmlFor="bestseller">
                    Add to bestseller
                </label>
            </div>

            {/* =========================
                SUBMIT
            ========================= */}

            <button
                type="submit"
                disabled={loading}
                className="w-32 py-3 mt-4 bg-black text-white disabled:opacity-50"
            >
                {loading ? "Saving..." : editId ? "UPDATE" : "ADD"}
            </button>
        </form>
    );
};

export default Add;
