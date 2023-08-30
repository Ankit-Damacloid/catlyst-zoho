import React, { useEffect, useState } from 'react'
import Logout from '../../Logout'
import { checkRoute } from '../../../utils/cookie'
import axios from 'axios';


function Users() {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        axios
            .get('/server/user_function/all', {   //Ensure that 'to_do_list_function' is the package name of your function.
                params: { page: 1, perPage: 200 } //The parameters contain the start limit and the end limit of data (tasks) that can be fetched from the data store
            })
            .then((response) => {
                // const {
                //   data: { title, description, assign_to, status, id }
                // } = response.data;
                const { userRes } = response.data.data
                console.log('user admin uE', response.data.status, userRes);
                if (response.data.status) {
                    setAllUsers(userRes)
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
        url.pathname = "/app/register";
        return window.location = url.href;
    }

    const addUser = (e) => {
        e.preventDefault();
        const url = new URL(window.location);
        url.pathname = "/app/register";
        return window.location = url.href;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px 20px" }}>
                <div>User List</div>
                <button onClick={addUser}>Add User</button>
                <Logout />
            </div>
            <div className="grid md:grid-cols-3 gap-2">
                {(allUsers.length > 0) ? (
                    <div style={{ marginBottom: 20, marginLeft: 80, display: 'flex', justifyContent: 'space-evenly' }}>
                        <p>ID</p>
                        <p style={{ marginLeft: 90 }}>NAME</p>
                        <p style={{ marginLeft: 90 }}>Email</p>
                        <p className="text-slate-400 my-2">
                            <span className="mr-1">ADMIN/USER</span>
                        </p>
                    </div>

                ) : null}
                {(allUsers.length > 0) ? (
                    allUsers.map(user => (
                        <div key={user.id} style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-evenly' }}>
                            <p>{user.id}</p>
                            <p className="text-slate-300">{user.name}</p>
                            <p className="text-slate-300">{user.email}</p>
                            <p className="text-slate-400 my-2">
                                <span className="mr-1">{((user.role == 1) ? "Admin" : "User")}</span>
                            </p>
                        </div>
                    ))
                ) : null}
            </div>
        </>
    )

}

export default Users