import React, { useEffect, useState } from 'react'
import Logout from '../Logout'
import { checkRoute } from '../../utils/cookie'
import axios from 'axios';
import Registration from '../registration/Registration';

function Admin() {
  const [allTicket, setAllTicket] = useState([]);

  useEffect(() => {
    axios
      .get('/server/ticket_function/all', {   //Ensure that 'to_do_list_function' is the package name of your function.
        params: { page: 1, perPage: 200 } //The parameters contain the start limit and the end limit of data (tasks) that can be fetched from the data store
      })
      .then((response) => {
        // const {
        //   data: { title, description, assign_to, status, title }
        // } = response.data;
        const { ticket } = response.data.data
        console.log('ticket uE', response.data.status, ticket);
        if (response.data.status) {
          setAllTicket(ticket)
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const { IS_ADMIN, IS_USER } = checkRoute();
  if (IS_ADMIN) {
    console.log('is admin');
  } else if (IS_USER) {
    const url = new URL(window.location);
    url.pathname = "/app/user";
    return window.location = url.href;
  }

  const goToUsers = (e) => {
    e.preventDefault();
    console.log('goToUsers clicks', e);
    const url = new URL(window.location);
    url.pathname = "/app/admin/user";
    return window.location = url.href;
  }

  const addTicket = (e) => {
    e.preventDefault();
    const url = new URL(window.location);
    url.pathname = "/app/admin/ticket/add";
    return window.location = url.href;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px 20px" }}>

        <div>Admin</div>
        <button onClick={goToUsers}>Users</button>
        <button onClick={addTicket}>Add Ticket</button>
        <Logout />
      </div>
      <div>
        {(allTicket.length > 0) ? (
          <div style={{ marginBottom: 20, marginLeft: 80, display: 'flex', justifyContent: 'space-evenly' }}>
            <p style={{ marginLeft: -80 }}>Title</p>
            <p >Description</p>
            <p className="text-slate-400 my-2">
              <span className="mr-1">Status</span>
            </p>
          </div>

        ) : null}
        {(allTicket.length > 0) ? (
          allTicket.map(ticket => (
            <div key={ticket.id} style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-evenly' }}>
              <p>{ticket.title}</p>
              <p className="text-slate-300">{ticket.description}</p>
              <p className="text-slate-400 my-2">
                <span className="mr-1">{((ticket.status == 1) ? "OPEN" : "CLOSED")}</span>
              </p>
            </div>
          ))
        ) : null}
      </div>
    </>
  )

}

export default Admin