import React from 'react'
import Login from "./Components/Login/Login"
import Registration from "./Components/registration/Registration"
import Admin from './Components/admin/Admin';
import User from './Components/user/User';
import AdminUserList from './Components/admin/users/User'
import AdminUserAdd from './Components/admin/users/AddUser'
import TicketUpdate from './Components/Ticket/Update'
import CreateTicket from './Components/Ticket/AddTicket'

function App() {
  // check for jwt token
  // if exist check then check for role based on that redirect to user or admin
  // if not the redirect to login page

  if (window.location.pathname) {
    console.log('app.js window.location', window.location.pathname);
  }
  switch (window.location.pathname) {
    case "/app/register":
      return <Registration />;
      break;
    case "/app/":
      return <Login />;
      break;
    case "/app/admin":
      return <Admin />;
      break;
    case "/app/admin/user":
      return <AdminUserList />;
      break;
    case "/app/admin/user/add":
      return <Registration />;
      break;
    case "/app/admin/ticket/add":
      return <CreateTicket />;
      break;

    case "/app/user":
      return <User />;
      break;
    default:
      window.location.href = "/app/";
      break;
  }
}

export default App