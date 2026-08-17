import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = "BDT- ";
  const delivery_fee = 80;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);


  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // ================= ADD TO CART =================

  const addToCart = async (itemId, size) => {

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {

      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      else {
        cartData[itemId][size] = 1;
      }

    }
    else {

      cartData[itemId] = {};
      cartData[itemId][size] = 1;

    }

    setCartItems(cartData);

    if (token) {
      try {

        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );

      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }

  };

  // ================= CART COUNT =================

  const getCartCount = () => {

    let totalCount = 0;

    for (const itemId in cartItems) {

      for (const size in cartItems[itemId]) {

        if (cartItems[itemId][size] > 0) {
          totalCount += cartItems[itemId][size];
        }

      }

    }

    return totalCount;

  };

  // ================= UPDATE QUANTITY =================

  const upDateQuantity = async (itemId, size, quantity) => {

    let cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {

      try {

        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );

      } catch (error) {

        console.log(error);
        toast.error(error.message);

      }

    }

  };

  // ================= CART TOTAL =================

  const getCartAmount = () => {

    let totalAmount = 0;

    for (const itemId in cartItems) {

      const itemInfo = products.find(
        (product) => String(product._id) === String(itemId)
      );

      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {

        const quantity = cartItems[itemId][size];

        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }

      }

    }

    return totalAmount;

  };

  // ================= GET PRODUCTS =================

  const getProductsData = async () => {

    try {

      const response = await axios.get(
        backendUrl + "/api/product/list-products"
      );

      if (response.data.success) {
        setProducts(response.data.products);
      }

    }
    catch (error) {

      console.log(error);
      toast.error(error.message);

    }

  };

  // ================= GET USER CART =================

  const getUserCart = async (token) => {

    try {

      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (response.data.success) {

        const backendCart = response.data.cartData || {};

        // Merge guest cart into the server cart when the user signs in.
        setCartItems((prev) => {
          const merged = structuredClone(backendCart);
          Object.entries(prev).forEach(([itemId, sizes]) => {
            merged[itemId] ||= {};
            Object.entries(sizes || {}).forEach(([size, quantity]) => {
              merged[itemId][size] = (merged[itemId][size] || 0) + Number(quantity || 0);
            });
          });
          return merged;
        });

      }

    }
    catch (error) {

      console.log(error);
      toast.error(error.message);

    }

  };

  // ================= LOAD PRODUCTS =================

  useEffect(() => {

    getProductsData();

  }, []);

  // ================= SAVE CART =================

  useEffect(() => {

    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  // ================= LOAD TOKEN =================

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) getUserCart(token);
  }, [token]);

  // ================= CONTEXT VALUE =================

  const value = {

    products,
    currency,
    delivery_fee,

    search,
    setSearch,

    showSearch,
    setShowSearch,

    cartItems,
    addToCart,
    setCartItems,

    getCartCount,
    upDateQuantity,
    getCartAmount,

    navigate,

    backendUrl,
    setToken,
    token,

  };

  return (

    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>

  );

};

export default ShopContextProvider;