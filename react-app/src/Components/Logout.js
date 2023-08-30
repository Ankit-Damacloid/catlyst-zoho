import React from 'react'
import { removeCookie } from '../utils/cookie'
function Logout() {

    const logout = (e) => {
        e.preventDefault();
        removeCookie("_token");
        removeCookie("_role");
        window.location.href =(new URL(window.location).pathname = "/");
    }
  return (
    <button onClick={logout}>Logout</button>
  )
}

export default Logout