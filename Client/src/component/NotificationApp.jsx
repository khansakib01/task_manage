import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:5001'); 

const NotificationApp = () => {
  useEffect(() => {

    socket.on('task_added', (data) => {
      toast.success(data.message); 
    });

    
    socket.on('task_updated', (data) => {
      toast.info(data.message); 
    });


    socket.on('task_deleted', (data) => {
      toast.error(data.message); 
    });


    return () => {
      socket.off('task_added');
      socket.off('task_updated');
      socket.off('task_deleted');
    };
  }, []);

  return (
    <div>
      
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default NotificationApp;
