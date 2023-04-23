import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import { Footer } from "./components/Footer";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import mapboxgl from "mapbox-gl";
import CreateBandobust from "./pages/CreateBandobust";
import Dashboard from "./pages/Dashboard";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

import axios from "axios";
import NotFound from "./pages/NotFound";
axios.defaults.baseURL = import.meta.env.VITE_URL;
axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "";

DarkReader.enable({
    brightness: 100,
    contrast: 100,
    sepia: 10,
});

const Layout = () => {
    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/create-bandobust", element: <CreateBandobust /> },
            { path: "/dashboard", element: <Dashboard /> },
            { path: "*", element: <NotFound /> },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    // {
    //     path: "/register",
    //     element: <Register />,
    // },
    ,
]);

function App() {
    return (
        <div className="app mx-auto">
            <ToastContainer theme="dark" />
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
