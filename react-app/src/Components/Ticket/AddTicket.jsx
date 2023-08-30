import React, { useState, useEffect } from 'react';
import "./ticket.css";
import axios from "axios";

const AddTicket = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: true,
        assign_to: {
            name: "",
            value: ""
        }
    });
    const [allUser, setAllUser] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios
            .get('/server/user_function/all', {   //Ensure that 'to_do_list_function' is the package name of your function.
                params: { page: 1, perPage: 200 } //The parameters contain the start limit and the end limit of data (tasks) that can be fetched from the data store
            })
            .then((response) => {
                const { userRes } = response.data.data
                console.log('uE', response.data.status, userRes);
                if (response.data.status) {
                    setAllUser(userRes)
                }
            })
            .catch((err) => {
                console.log(err.response);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name == "assign_to") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: JSON.parse(value)
            }));
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('form form submitted:', formData);
        createTicket(event)
    };

    const createTicket = (event) => {
        event.preventDefault();
        setSubmitting(true);
        console.log('formData', formData);
        axios
            .post('/server/ticket_function/add', formData)
            .then((response) => {
                console.log("response", response);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setSubmitting(false);
                const url = new URL(window.location);
                url.pathname = "/app/user";
                return window.location = url.href;
            });
    }

    return (
        <div className="login-container">
            <h1>Add Ticket</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="textarea"
                        rows="5" cols="33"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select name="status" id="status" onChange={handleChange}>
                        <option value="true">Open</option>
                        <option value="false">Closed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="assign_to">assign_to</label>
                    <select name="assign_to" id="assign_to" onChange={handleChange}>
                        {
                            (allUser.length > 0) ? (allUser.map(data => (
                                <option key={data.id} value={JSON.stringify({ name: data.name, id: data.id })}>{`${data.name} - ${data.email}`}</option>
                            ))) :
                                <option value="{}">default</option>
                        }

                    </select>
                </div>
                <button type="submit">Create Ticket</button>
            </form>
        </div>
    );
};

export default AddTicket;