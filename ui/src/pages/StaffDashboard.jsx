import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks/user', {
          headers: {
            
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/tasks/${selectedTask}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success('Task status updated successfully');
        setStatus('');
        setSelectedTask(null);
        // Refetch tasks or update state to reflect changes
        const updatedTasks = await fetch('/api/tasks/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        }).then(res => res.json());
        setTasks(updatedTasks);
      } else {
        toast.error('Failed to update task status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="mb-4 p-4 border border-gray-300 rounded">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Status: {task.status}</p>
              <button
                onClick={() => {
                  setSelectedTask(task._id);
                  setStatus(task.status);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                Update Status
              </button>
              {selectedTask === task._id && (
                <form onSubmit={handleStatusChange} className="mt-4">
                  <label className="block text-sm font-medium mb-1">New Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                  >
                    Save
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffDashboard;
