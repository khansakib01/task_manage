import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteTask from './DeleteTask';
import { Link } from 'react-router-dom';

const List = ({ refresh }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tasks');
      setTasks(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks(tasks.filter((task) => task.id !== deletedTaskId)); // Update state after deletion
  };

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-2">
      {/* Header */}
      <div className="grid grid-cols-5 bg-gray-200 p-3 rounded-lg shadow-md font-semibold text-gray-700 text-sm sm:text-base">
        <span className="text-center">#</span>
        <span className="text-center">Task Name</span>
        <span className="text-center">Status</span>
        <span className="text-center">Date</span>
        <span className="text-center">Actions</span>
      </div>

      {/* Task List */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="grid grid-cols-5 bg-gray-100 p-4 mt-3 rounded-lg shadow-md text-sm sm:text-base"
        >
          <span className="text-center">{task.id}</span>
          <span className="text-center">{task.task_name}</span>
          <span className="text-center">{task.status}</span>
          <span className="text-center">{task.created_at.split('T')[0]}</span>
          <div className="flex justify-center gap-2">
            <Link
              to={`/update/${task.id}`}
              className="p-1 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              Update
            </Link>
            <DeleteTask taskId={task.id} onTaskDeleted={handleTaskDeleted} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
