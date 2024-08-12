import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewTaskPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('Loading...');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/name`, {
          headers: {
          },
        });

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (response.ok) {
            setProjectName(data.name || 'Unknown Project');
          } else {
            toast.error(data.error || 'Failed to fetch project name');
          }
        } else {
          const text = await response.text();
          console.error('Unexpected response:', text);
          toast.error('Failed to fetch project name');
        }
      } catch (error) {
        console.error('Error fetching project name:', error);
        toast.error('Failed to fetch project name');
      }
    };

    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTasks(data);
          setFilteredTasks(data);
        } else {
          toast.error(data.error || 'Failed to fetch task details');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        toast.error('Failed to fetch task details');
      }
    };

    const fetchData = async () => {
      await fetchProjectName();
      await fetchTaskDetails();
      setLoading(false);
    };

    fetchData();
  }, [projectId]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    if (selectedStatus) {
      const filtered = tasks.filter(task => task.status === selectedStatus);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  };

  const handleNavigateToFeedback = (taskId) => {
    navigate(`/feedback/${projectId}/${taskId}`); // Navigate to feedback page for specific task
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tasks for Project {projectName}</h1>

      <select
        value={status}
        onChange={handleStatusChange}
        className="border p-2 w-full mb-4"
      >
        <option value="">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In-Progress</option>
        <option value="completed">Completed</option>
      </select>

      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => (
          <div key={task._id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
            <p className="mb-4">{task.description}</p>
            <p className="mb-4">
              Status: 
              <span className={`font-semibold ${task.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                {task.status}
              </span>
            </p>
            <p className="mb-4">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="mb-4">Assigned To: {task.assignedTo}</p>
            <button
              onClick={() => handleNavigateToFeedback(task._id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Provide Feedback
            </button>
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default ViewTaskPage;
