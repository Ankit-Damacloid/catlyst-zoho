import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from "axios";
import { getCookie, parseJwt,setCookie } from '../../utils/cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tokenCookie = getCookie("_token");
    console.log('tokenCookie', tokenCookie);
    const url = new URL(window.location);
    if(tokenCookie){
      // url.pathname = "/app/";
      // return window.location = url.href;
      const token = parseJwt(tokenCookie);
      console.log('token', token);
      console.log('test', new URL(window.location));
      if(token.role == "1") {
        url.pathname = "/app/admin";
        return window.location = url.href;}
      else if(token.role == "2") {
        url.pathname = "/app/user";
        return window.location = url.href;
      }
    }

  }, [])


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login form submitted:', formData);
    loginUser(event)
  };

  const loginUser = (event) => {
      event.preventDefault();
      setSubmitting(true);
      console.log('formData', formData);
      axios
        .post('/server/user_function/login', formData)
        .then((response) => {
          console.log("response", response.data.data);
          setCookie("_token", response.data.data.token);
          setCookie("_role", response.data.data.user.role)
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;