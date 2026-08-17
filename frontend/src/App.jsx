import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

// pages import
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Login from './pages/Login'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import VerifyEmail from './pages/VerifyEmail'

// Toastify import
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context import
import ShopContextProvider from './context/ShopContext'

const App = () => {
  return (
    <ShopContextProvider>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        {/* Toast Container */}
        <ToastContainer position="top-center" autoClose={2000} />

        {/* Common Components */}
        <Navbar />
        <SearchBar />

        {/* Routing */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>

        <Footer />
      </div>
    </ShopContextProvider>
  )
}

export default App
