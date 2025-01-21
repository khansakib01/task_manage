import React, { useState } from 'react';
import axios from 'axios';

const Home = ({ onTaskAdded }) => {
    const [taskName, setTaskName] = useState('');
    const [status, setStatus] = useState('pending');
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (taskName.trim() === '') {
            alert('Task name cannot be empty');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/tasks', {
                task_name: taskName,
                status: status 
            });
            onTaskAdded(response.data);
            console.log(response.data);
            setTaskName(''); 
            setStatus('pending'); 
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task');
        }
        finally{
            setLoading(false)
        }
    };
    return (
        <div className={'flex flex-col justify-center items-center gap-3'}>
            <h2 className={'font-mono text-sm md:text-lg lg:text-xl text-red-500 mt-2'}>Add a New Task</h2>
            <form onSubmit={handleSubmit} className={'flex flex-col justify-center items-center gap-2 md:gap-4 lg:gap-8'}>
                <input
                    className={'border bg-transparent border-black border-1 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                    type="text"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
                {loading&&<p>loading...</p>}
                <p className={'text-center text-blue-600 font-mono'}>Status:</p>
                <select className={'w-40 bg-transparent border-black border-1 border rounded-sm text-red-700 cursor-pointer'} value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option  value="pending" >Pending</option>
                    <option value="completed">Completed</option>
                    <option  value="in progress" >In Progress</option>
                </select>
                <button className={'p-1  border-2 bg-green-300 w-40 rounded-md border-green-300 font-bold text-red-500 hover:bg-green-600 hover:text-red-400'} type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default Home;
