import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProductScreen from "./pages/productScreen";
import Cart from "./pages/cart";
import User from "./pages/profile";
import SigninScreen from "./pages/signinScreen";

import PaymentMethod from "./pages/paymentMethod";
import ShippingAddressScreen from "./pages/shippingScreen";
import PreviewOrder from "./pages/previewOrder";

import Hearder from "./components/header";
import Footer from "./components/footer";
import OrderHistory from "./pages/orderHistory";
import SignupScreen from "./pages/signupScreen";
import Shopping from "./pages/shopping";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";
import OrderResult from "./pages/orderResult";
import OrderDetail from "./pages/orderDetail";
import Profile from "./pages/profile";
import Products from "./pages/Admin/products";
import Users from "./pages/Admin/users";
import Categories from "./pages/Admin/categories";
import Modal from "./pages/test";
import MyProducts from "./pages/Seller/myproducts";
import PassWordChange from "./pages/passwordChange";
import MyOrders from "./pages/Seller/myorders";
import Orders from "./pages/Admin/orders";
import TestShipper from "./pages/testShipper";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/signin" element={<SigninScreen/>} />
        <Route path="/signup" element={<SignupScreen/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/shipping" element={<ShippingAddressScreen/>} />
        <Route path="/paymentmethod" element={<PaymentMethod/>} />
        <Route path="/placeorder" element={<PreviewOrder/>} />
        <Route path="/orderdetail/:id" element={<OrderDetail/>} />
        <Route path="/ordersuccess/:id" element={<OrderResult/>} />
        <Route path="/orderhistory" element={<OrderHistory/>} />
        <Route path="/shopping" element={<Shopping/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/myproducts" element={<MyProducts/>} />
        <Route path="/passwordchange" element = {<PassWordChange/>} />
        <Route path="/myorders" element = {<MyOrders/>} />
        <Route path="/orders" element = {<Orders/>} />

        <Route path="/shipper" element = {<TestShipper/>} />

        {/* <Route path="/admin/orderlist" element={<OrderList/>} /> */}
        {/* <Route path="/shopping" element= {<Shopping/>} /> */}

        {/* <Route path="/test" element={<Modal/>} /> */}

        
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
