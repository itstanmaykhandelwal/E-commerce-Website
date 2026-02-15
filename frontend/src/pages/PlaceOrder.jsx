import React, { useContext, useState, useEffect, useRef } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import JustValidate from "just-validate";
import { assets } from "../assets/assets";

const PlaceOrder = () => {

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    phone: "",
  });

  const [lastAddress, setLastAddress] = useState(
    JSON.parse(localStorage.getItem("lastAddress")) || null
  );

  const formRef = useRef(null);
  const validateRef = useRef(null);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION FIX ================= */

  useEffect(() => {
    if (!formRef.current) return;

    if (validateRef.current) {
      validateRef.current.destroy();
    }

    const validate = new JustValidate(formRef.current, {
      errorFieldCssClass: "border-red-500",
      errorLabelCssClass: "text-red-500 text-sm mt-1",
      focusInvalidField: true,
    });

    const fields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "phone"
    ];

    fields.forEach((field) => {
      validate.addField(
        `#${field}`,
        [
          { rule: "required", errorMessage: `${field} required` }
        ],
        { errorsContainer: `#${field}-error` }
      );
    });

    validate.onSuccess(() => {
      onSubmitHandler();
    });

    validateRef.current = validate;

    return () => validate.destroy();

  }, []);

  /* ================= ORDER SUBMIT ================= */

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            navigate("/orders");
            setCartItems({});
          } else {
            toast.error(data.message);
          }
        } catch {
          toast.error("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async () => {

    try {
      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          for (const color in cartItems[itemId][size]) {

            const quantity = cartItems[itemId][size][color];

            if (quantity > 0) {
              const itemInfo = structuredClone(
                products.find(product => product._id === itemId)
              );

              if (itemInfo) {
                itemInfo.size = size;
                itemInfo.color = color;
                itemInfo.quantity = quantity;
                orderItems.push(itemInfo);
              }
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {

        case "cod":
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message);
          }
          break;

        case "stripe":
          const stripeRes = await axios.post(
            backendUrl + "/api/order/stripe",
            { ...orderData, frontendUrl: window.location.origin },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (stripeRes.data.success) {
            window.location.replace(stripeRes.data.session_url);
          }
          break;

        case "razorpay":
          const razorRes = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (razorRes.data.success) {
            initPay(razorRes.data.order);
          }
          break;
      }

      localStorage.setItem("lastAddress", JSON.stringify(formData));
      setLastAddress(formData);

    } catch (error) {
      console.log(error);
    }
  };

  const useLastAddress = () => {
    if (lastAddress) {
      setFormData(lastAddress);
      toast.success("Address loaded");
    }
  };

  /* ================= UI ================= */

  return (
    <form
      ref={formRef}
      noValidate
      className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white pt-16 px-4"
    >

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* LEFT SECTION */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl">

          <Title text1="DELIVERY" text2="INFORMATION" />

          <div className="mt-6 space-y-5">

            <div className="flex gap-4">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="w-full">
                  <input
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={onChangeHandler}
                    placeholder={field}
                    className="border border-emerald-200 px-4 py-3 rounded-xl w-full focus:ring-2 focus:ring-emerald-500"
                  />
                  <div id={`${field}-error`}></div>
                </div>
              ))}
            </div>

            {["email", "street", "city", "state", "zipcode", "phone"].map((field) => (
              <div key={field}>
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={onChangeHandler}
                  placeholder={field}
                  className="border border-emerald-200 px-4 py-3 rounded-xl w-full focus:ring-2 focus:ring-emerald-500"
                />
                <div id={`${field}-error`}></div>
              </div>
            ))}

          </div>

          {lastAddress && (
            <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <p className="font-semibold mb-2">Use last address?</p>
              <button
                type="button"
                onClick={useLastAddress}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-xl"
              >
                Use this address
              </button>
            </div>
          )}

        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-[420px] bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl">

          <CartTotal />

          <div className="mt-8 space-y-4">

            <Title text1="PAYMENT" text2="METHOD" />

            {[
              { key: "stripe", label: assets.stripe_logo },
              { key: "razorpay", label: assets.razorpay_logo },
              { key: "cod", label: "Cash On Delivery" }
            ].map(option => (
              <div
                key={option.key}
                onClick={() => setMethod(option.key)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  method === option.key
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-emerald-200"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border ${method === option.key ? "bg-emerald-600" : ""}`} />

                {option.key === "cod" ? (
                  <p className="text-sm font-medium">{option.label}</p>
                ) : (
                  <img className="h-6" src={option.label} />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              PLACE ORDER
            </button>

          </div>

        </div>

      </div>
    </form>
  );
};

export default PlaceOrder;
