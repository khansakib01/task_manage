import React from 'react';
import axios from 'axios';

const DeleteTask = ({ taskId, onTaskDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5001/api/tasks/${taskId}`);
        onTaskDeleted(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  return (
    <button
      className="p-1 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
};

export default DeleteTask;
