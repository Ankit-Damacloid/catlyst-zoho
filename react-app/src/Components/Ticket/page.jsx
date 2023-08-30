import { useState, useEffect } from "react";

const Ticket = ({ ticket }) => {
  // const [ticket, setTicket] = useState({
  //   title: "",
  //   description: "",
  //   assign_to: 0,
  //   status: true
  // });

  const [allTicket, setAllTicket] = useState([{
    id: "",
    title: "",
    description: "",
    assign_to: 0,
    status: true
  }]);

  const params = {}
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //     axios
  //       .get('/server/ticket_function/all', {   //Ensure that 'to_do_list_function' is the package name of your function.
  //         params: { page, perPage: 200 } //The parameters contain the start limit and the end limit of data (tasks) that can be fetched from the data store
  //       })
  //       .then((response) => {
  //         // const {
  //         //   data: { title, description, assign_to, status, id }
  //         // } = response.data;

  //         console.log('ticket uE', response.data);
  //       })
  //       .catch((err) => {
  //         console.log(err.response);
  //       });
  // }, []);


  // const getTask = async () => {
  //   const res = await fetch(`/api/tasks/${params.id}`);
  //   const data = await res.json();
  //   setTicket({ title: data.title, description: data.description, hobbieString: data.hobby.toString() });
  // };

  // useEffect(() => {
  //   if (params.id) {
  //     getTask();
  //   }
  // }, []);

  const handleSubmit = async (e) => {
    // const toSplit = ticket.hobbieString.split(",");
    // setTicket({ ...ticket, hobby: toSplit });
    e.preventDefault();
    let errs = validate();

    if (Object.keys(errs).length) return setErrors(errs);
    setIsSubmitting(true);
    console.log('after submint');
    // if (params.id) {
    //   await updateTask();
    // } else {
    //   await createTask();
    // }

    // router.push("/");
  };


  const validate = () => {
    let errors = {};

    if (!ticket.title) {
      errors.title = "Title is required";
    }
    if (!ticket.description) {
      errors.description = "Description is required";
    }

    return errors;
  };

  // const createTask = async () => {
  //   try {

  //     await fetch("/api/tasks", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updateHobbyArray()),
  //     });
  //     router.push("/");
  //     router.refresh();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleDelete = async () => {
  //   if (window.confirm("Are you sure you want to delete this task?")) {
  //     try {
  //       const res = await fetch(`/api/tasks/${params.id}`, {
  //         method: "DELETE",
  //       });
  //       router.push("/");
  //       router.refresh();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  // const updateTask = async () => {
  //   try {
  //     await fetch(`/api/tasks/${params.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updateHobbyArray()),
  //     });
  //     router.push("/");
  //     router.refresh();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // return (
  //   <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center">
  //     <form onSubmit={handleSubmit}>
  //       <header className="flex justify-between">
  //         <h1 className="font-bold text-3xl">
  //           {!params.id ? "Create Task" : "Update task"}
  //         </h1>
  //         {params.id && (
  //           <button
  //             className="bg-red-500 px-3 py-1 rounded-md"
  //             onClick={handleDelete}
  //           >
  //             Delete
  //           </button>
  //         )}
  //       </header>
  //       <input
  //         type="text"
  //         placeholder="Task title"
  //         name="title"
  //         onChange={handleChange}
  //         value={ticket.title}
  //         autoFocus
  //         className="bg-gray-800 border-2 w-full p-4 rounded-lg my-4"
  //       />

  //       <textarea
  //         name="description"
  //         placeholder="Task description"
  //         onChange={handleChange}
  //         value={ticket.description}
  //         className="bg-gray-800 border-2 w-full p-4 rounded-lg my-4"
  //         rows={3}
  //       ></textarea>

  //       <textarea
  //         name="hobbieString"
  //         placeholder="list hobby"
  //         onChange={handleChange}
  //         value={ticket.hobbieString}
  //         className="bg-gray-800 border-2 w-full p-4 rounded-lg my-4"
  //         rows={3}
  //       ></textarea>
  //       <button className="bg-green-600 text-white font-semibold px-8 py-2 rounded-lg">
  //         {params.id ? "Update" : "Save"}
  //       </button>
  //     </form>
  //   </div>
  // );

  return (
    // <Link href={`/tasks/${task._id}`}>
    <div className="bg-gray-800 p-10 text-white rounded-md hover:cursor-pointer hover:bg-gray-700">
      <h4 className="text-2xl font-bold">{ticket.title}</h4>
      <p className="text-slate-300">{ticket.description}</p>
      <p className="text-slate-400 my-2">
        <span className="mr-1">Status: {((ticket.status == 1) ? "OPEN" : "CLOSED")}</span>
        {/* {new Date(task.createdAt).toLocaleDateString()} */}
      </p>
    </div>
    // </Link>
  );
};

export default Ticket;
