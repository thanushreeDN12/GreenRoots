import React from "react";
import HomePage from "./components/HomePage.jsx";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from "./components/LoginPage.jsx";
import AdminProfile from "./components/AdminProfile.jsx";
import Navbar from "./components/Navbar.jsx";
import SingleProgram from './components/SingleProgram.jsx'
import Payment from "./components/Payment.jsx";
import UserProfile from "./components/UserProfile.jsx";
import DonateCTA from "./components/DonateCTA.jsx";
import Footer from "./components/Footer.jsx";


const App = () => {
    return(
       
        <BrowserRouter>
         <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/adminprofile" element={<AdminProfile />} />
                <Route path="/program/:id" element={<SingleProgram />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/donate" element={<DonateCTA />} />

                <Route path="/contact" element={<Footer />} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App;
