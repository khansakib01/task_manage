import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/tasks/${id}`);
        setTaskName(response.data.task_name);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching task:', error);
        alert('Failed to fetch task details');
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (taskName.trim() === '') {
      alert('Task name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:5001/api/tasks/${id}`, {
        task_name: taskName,
        status: status,
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h2 className="text-lg sm:text-xl font-mono text-red-500 mb-4">Update Task</h2>
      <form
        onSubmit={handleUpdate}
        className="flex flex-col justify-center items-center gap-4 w-full max-w-sm"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <div className="w-full">
          <label className="block mb-2 text-sm font-mono text-blue-600">Status:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option  value="In Progress" >In Progress</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Task'}
        </button>
      </form>
    </div>
  );
}

export default Update;
