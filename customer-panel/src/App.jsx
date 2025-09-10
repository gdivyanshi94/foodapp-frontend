import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Orders from "./pages/Orders/Orders";
import Products from "./pages/Products/Products";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";
import Success from './pages/Payment/Success'
import Error from './pages/Payment/Error'
import AuthProvider from "./providers/AuthProvider";
import Messages from './pages/Messages/Messages'
function App() {
  
  return (
    <div>
      <AuthProvider>
        <Routes>
        <Route
            path='/success'
            element={<Success />}
          />
          <Route
            path='/cancel'
            element={<Error />}
          />
          <Route index path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={ <NotFound />} />

          {/* Parent Component */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            {/* Child Components */}
            <Route path="products" element={<Products />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path='messages'
              element={<Messages />}
            />
          </Route>
        </Routes>
      </AuthProvider>

      <ToastContainer />
    </div>
  );
}

export default App;
