import React, { useContext, useState, useEffect, useRef } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import JustValidate from 'just-validate';

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        // country: '',
        phone: '',
    });
    const [lastAddress, setLastAddress] = useState(
        JSON.parse(localStorage.getItem('lastAddress')) || null
    );

    const formRef = useRef(null);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    // ✅ JustValidate setup
    useEffect(() => {
        if (!formRef.current) return;

        const validate = new JustValidate(formRef.current, {
            errorFieldCssClass: "border-red-500",
            focusInvalidField: true,
        });

        validate
            .addField("#firstName", [
                { rule: "required", errorMessage: "First name is required" },
                { rule: "minLength", value: 2, errorMessage: "At least 2 characters" },
            ])
            .addField("#lastName", [
                { rule: "required", errorMessage: "Last name is required" },
                { rule: "minLength", value: 2, errorMessage: "At least 2 characters" },
            ])
            .addField("#email", [
                { rule: "required", errorMessage: "Email is required" },
                { rule: "email", errorMessage: "Enter a valid email" },
            ])
            .addField("#street", [
                { rule: "required", errorMessage: "Street is required" },
            ])
            .addField("#city", [
                { rule: "required", errorMessage: "City is required" },
            ])
            .addField("#state", [
                { rule: "required", errorMessage: "State is required" },
            ])
            .addField("#zipcode", [
                { rule: "required", errorMessage: "Zipcode is required" },
                { rule: "number", errorMessage: "Only numbers allowed" },
                { rule: "minLength", value: 4, errorMessage: "Min 4 digits" },
            ])
            // .addField("#country", [
            //     { rule: "required", errorMessage: "Country is required" },
            // ])
            .addField("#phone", [
                { rule: "required", errorMessage: "Phone number is required" },
                { rule: "number", errorMessage: "Only numbers allowed" },
                { rule: "minLength", value: 10, errorMessage: "Min 10 digits" },
                { rule: "maxLength", value: 15, errorMessage: "Max 15 digits" },
            ])
            .onSuccess(() => {
                onSubmitHandler();
            });

    }, [formRef]);

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: "Order Payment",
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
                } catch (error) {
                    console.log(error);
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

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            };

            switch (method) {
                case 'cod':
                    const response = await axios.post(
                        backendUrl + '/api/order/place',
                        orderData,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (response.data.success) {
                        setCartItems({});
                        navigate('/orders');
                    } else {
                        toast.error(response.data.message);
                    }
                    break;
                case 'stripe':
                    const responseStripe = await axios.post(
                        backendUrl + '/api/order/stripe',
                        { ...orderData, frontendUrl: window.location.origin },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                    }
                    break;
                case 'razorpay':
                    const responseRazorpay = await axios.post(
                        backendUrl + '/api/order/razorpay',
                        orderData,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order);
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        }
        localStorage.setItem('lastAddress', JSON.stringify(formData));
        setLastAddress(formData);
    };

    const useLastAddress = () => {
        if (lastAddress) {
            setFormData(lastAddress);
            toast.success('Address loaded!');
        }
    };

    return (
        <form ref={formRef} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t ' noValidate>
            {/* Left Side */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <div>

                    <input id="firstName" name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    </div>
                    <div>

                    <input id="lastName" name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                    </div>
                </div>
                <input id="email" name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input id="street" name='street' value={formData.street} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <div>
                    <input id="city" name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    </div>
                    <div>
                    <input id="state" name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                    </div>
                </div>
                    <div>
                    <input id="zipcode" name='zipcode' value={formData.zipcode} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Zipcode' />
                    </div>
                {/* <div className='flex gap-3'>
                    <div>
                    <input id="country" name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                    </div>
                </div> */}
                <input id="phone" name='phone' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone' />

                {lastAddress && (
                    <div className="mt-6 p-4 border rounded shadow-md bg-gray-50">
                        <h3 className="font-semibold mb-2">Use last used address?</h3>
                        <p>{lastAddress.firstName} {lastAddress.lastName}</p>
                        <p>{lastAddress.street}, {lastAddress.city}, {lastAddress.state}</p>
                        <p>{lastAddress.zipcode}, 
                            {/* {lastAddress.country} */}
                            </p>
                        <p>Phone: {lastAddress.phone}</p>
                        <button type="button" onClick={useLastAddress} className='mt-2 bg-black text-white px-12 py-3 text-sm'>
                            Use this address
                        </button>
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>
                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="stripe-logo" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="razorpay-logo" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder;
