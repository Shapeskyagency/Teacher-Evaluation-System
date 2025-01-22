import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { AntDesignOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserLogin } from "../redux/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => password.length >= 6;

  // Form submission handler
  const handleLogin = () => {
    let emailError = "";
    let passwordError = "";

    if (!validateEmail(email)) {
      emailError = "Please enter a valid email.";
    }

    if (!validatePassword(password)) {
      passwordError = "Password must be at least 6 characters.";
    }

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      // Proceed with login

      dispatch(UserLogin({email:email, password:password})).then((res)=>{
        if(res?.payload?.token){
          localStorage.setItem("token",res?.payload?.token)
          message.success("Logging in...");
          // navigate("/")
          window.location.replace("/");
        }
      })

      
      // Add login functionality here
    } else {
      message.error("Please fix the errors before submitting.");
    }
  };

  return (
    <Col
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="border py-4 px-4 rounded-4 w-100" style={{ maxWidth: "458px" }}>
        <div className="mb-4">
          <h2 className="text-center">User Login</h2>
          <p className="text-center">Enter your registered email and password</p>
        </div>
        
        <div className="mb-3">
        <Input
          size="large"
          placeholder="Email"
          prefix={<UserOutlined />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
          status={errors.email && "error"}
        />
        {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>
        <div className="mb-3">
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2"
          status={errors.password && "error"}
        />
        {errors.password && <p className="text-danger">{errors.password}</p>}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          
            <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={handleLogin}>
              Login
            </Button>
          
          <Link to="/forget-password">Forget Password</Link>
        </div>
      </div>
    </Col>
  );
}

export default Login;
