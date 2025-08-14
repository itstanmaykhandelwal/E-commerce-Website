import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'

const App = () => {
    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]'>
            <ToastContainer/>
            <Navbar />
            <SearchBar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/product/:productId" element={<Product />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App