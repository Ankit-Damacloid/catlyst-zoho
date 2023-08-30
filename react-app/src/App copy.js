// import './App.css';
// import './helper.css';

// import axios from 'axios';
// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

// //This segment contains the logic that displays each individual task present in the to-do list

// const Task = forwardRef(({ id, notes, index, removeTask }, ref) => {
//   const [deleting, setDeleting] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);

//   const onMouseEnter = useCallback(() => {
//     setShowOptions(true);
//   }, []);

//   const onMouseLeave = useCallback(() => {
//     setShowOptions(false);
//   }, []);

// //Contains the logic to delete the taks from the Datastore

//   const deleteTask = useCallback(() => {
//     setDeleting(true);
//     axios
//       .delete(`/server/to_do_list_function/${id}`)     //Ensure that 'to_do_list_function' is the package name of your function.
//       .then((response) => {
//         const {
//           data: {
//             todoItem: { id }
//           }
//         } = response.data;
//         removeTask(id);
//       })
//       .catch((err) => {
//         console.log(err.response);
//       }).finally(()=>{
//         setDeleting(false)
//       })
//   }, [id, removeTask]);

//   return (
//     <div
//       className='task'
//       ref={ref}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       <p className='task__no'>{index + 1 + ') '}</p>
//       <p className='task__title'>{notes}</p>
//       {deleting ? (
//         <div className='loader--xs'></div>
//       ) : (
//         showOptions && (
//           <button onClick={deleteTask}>
//             <svg
//               className='task__btn'
//               fill='none'
//               stroke='currentColor'
//               viewBox='0 0 24 24'
//               xmlns='http://www.w3.org/2000/svg'
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 strokeWidth='2'
//                 d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
//               ></path>
//             </svg>
//           </button>
//         )
//       )}
//     </div>
//   );
// });

// //This segment contains the logic for loading the application

// function App() {
//   const observer = useRef(null);

//   const [page, setPage] = useState(1);
//   const [notes, setNotes] = useState('');
//   const [todoItems, setTodoItems] = useState([]);
//   const [hasMore, setHasMore] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [fetchState, setFetchState] = useState('init');

//   const onChange = useCallback((event) => {
//     const { value } = event.target;
//     setNotes(value);
//   }, []);

//   useEffect(() => {
//     if (fetchState !== 'fetched') {
//       axios
//         .get('/server/to_do_list_function/all', {   //Ensure that 'to_do_list_function' is the package name of your function.
//           params: { page, perPage: 200 } //The parameters contain the start limit and the end limit of data (tasks) that can be fetched from the data store
//         })
//         .then((response) => {
//           const {
//             data: { todoItems, hasMore }
//           } = response.data;

//           if (page === 1) {
//             setTodoItems(todoItems);
//           } else {
//             setTodoItems((prev) => [
//               ...new Map(
//                 Array.from(prev)
//                   .concat(todoItems)
//                   .map((item) => [item.id, item])
//               ).values()
//             ]);
//           }
//           setHasMore(hasMore);
//           setFetchState('fetched');
//         })
//         .catch((err) => {
//           console.log(err.response);
//         });
//     }
//   }, [fetchState, page]);

//   const lastElement = useCallback(
//     (node) => {
//       if (fetchState !== 'fetched') {
//         return;
//       }
//       if (observer.current) {
//         observer.current.disconnect();
//       }
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((c) => c + 1);
//           setFetchState('loading');
//         }
//       });
//       if (node) {
//         observer.current.observe(node);
//       }
//     },
//     [fetchState, hasMore]
//   );

// /// This segment contains the logic for creating a new task

//   const createTodo = useCallback(
//     (event) => {
//       event.preventDefault();
//       setSubmitting(true);
//       axios
//         .post('/server/to_do_list_function/add', {    //Ensure that 'to_do_list_function' is the package name of your function.
//           notes
//         })
//         .then((response) => {
//           const {
//             data: { todoItem }
//           } = response.data;
//           setNotes('');
//           setTodoItems((prev) => [{ ...todoItem }].concat(Array.from(prev)));
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//         .finally(() => {
//           setSubmitting(false);
//         });
//     },
//     [notes]
//   );

// //This segment contains the logic for deleting a task from the application

//   const removeTask = useCallback((id) => {
//     setTodoItems((prev) => Array.from(prev).filter((obj) => obj.id !== id));
//   }, []);

//   return (
//     <div className='container'>
//       {fetchState === 'init' ? (
//         <div className='dF aI-center jC-center h-inh'>
//           <div className='loader--lg'></div>
//         </div>
//       ) : (
//         <>
//           <div className='title-container px-20'>
//             <p className='text-white text-28 font-700'>To Do</p>
//           </div>
//           <div className='create-container'>
//             <form className='dF aI-center w-full' onSubmit={createTodo}>
//               <input
//                 type='text'
//                 value={notes}
//                 onChange={onChange}
//                 placeholder='Enter a Task'
//                 className='input input--valid'
//                 readOnly={submitting}
//               />
//               <button
//                 className='btn btn--primary ml-10'
//                 disabled={!notes.length || submitting}
//                 type='submit'
//               >
//                 Create Task
//                 {submitting && (
//                   <div className='btn--primary__loader ml-5'></div>
//                 )}
//               </button>
//             </form>
//           </div>
//           <div className='task-container'>
//             {todoItems.length ? (
//               todoItems.map((item, index) => (
//                 <Task
//                   key={item.id}
//                   {...item}
//                   ref={index === todoItems.length - 1 ? lastElement : null}
//                   index={index}
//                   removeTask={removeTask}
//                 />
//               ))
//             ) : (
//               <div className='p-20 dF jC-center'>
//                 <p className='text-info text-16'>
//                   No tasks available, Create a new task.
//                 </p>
//               </div>
//             )}
//             {fetchState === 'loading' && (
//               <div className='dF jC-center my-5'>
//                 <div className='loader--sm'></div>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;