import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import image from "../images/authPageSide.png";
import { api_base_url } from "../helper";  // Ensure this has the correct base URL

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    fetch(api_base_url + "/users/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pwd,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success === true) {
          // Store JWT token and user ID in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userId", data.userId);

          // Navigate to the homepage or dashboard
          navigate("/");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Login failed. Please try again.");
        console.error("Error during login:", error);
      });
  };

  return (
    <>
      <div className="container w-screen min-h-screen flex items-center justify-between pl-[100px]">
        <div className="left w-[35%]">
          <img className="w-[200px]" src={logo} alt="Logo" />
          <form onSubmit={submitForm} className="w-full mt-[60px]" action="">
            <div className="inputBox">
              <input
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                type="email"
                placeholder="Email"
              />
            </div>

            <div className="inputBox">
              <input
                required
                onChange={(e) => {
                  setPwd(e.target.value);
                }}
                value={pwd}
                type="password"
                placeholder="Password"
              />
            </div>

            <p className="text-[gray]">
              Dont have an account?{" "}
              <Link to="/signUp" className="text-[#00AEEF]">
                Sign Up
              </Link>
            </p>

            <p className="text-red-500 text-[14px] my-2">{error}</p>

            <button className="btnBlue w-full mt-[20px]">Login</button>
          </form>
        </div>
        <div className="right w-[55%]">
          <img
            className="h-[100vh] w-[100%] object-cover"
            src={image}
            alt="Auth Page Side"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
