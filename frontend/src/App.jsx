import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Editior from './pages/Editor';

const App = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // Check if the user is logged in

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/editor/:projectID' element={isLoggedIn ? <Editior /> : <Navigate to="/login" />} /> {/* Fixed typo in path */}
        <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
