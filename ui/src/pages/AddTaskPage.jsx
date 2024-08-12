import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddTaskPage = () => {
  const { projectId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [status, setProjectStatus] = useState('pending');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchStaff = async () => {
  //     try {
  //       const response = await fetch(`/api/projects/${projectId}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //         credentials: 'include',
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch staff members');
  //       }

  //       const data = await response.json();
  //       setStaffList(data);
  //     } catch (error) {
  //       console.error('Error fetching staff members:', error);
  //       toast.error('Failed to fetch staff members');
  //     }
  //   };

  //   if (projectId) {
  //     fetchStaff();
  //   }
  // }, [projectId]);
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch staff members');
        }
  
        const data = await response.json();
        setStaffList(data); // data should be an array of { username, createdAt }
      } catch (error) {
        console.error('Error fetching staff members:', error);
        toast.error('Failed to fetch staff members');
      }
    };
  
    if (projectId) {
      fetchStaff();
    }
  }, [projectId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ title, description, dueDate, assignedTo, status, projectId }),
      });

      if (res.ok) {
        toast.success('Task created successfully');
        navigate('/manager-dashboard');
      } else {
        toast.error('Failed to create task');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Project status updated successfully');
        setProjectStatus(newStatus);
      } else {
        toast.error('Failed to update project status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Assign To</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Staff Member</option>
            {staffList.map((staff) => (
              <option key={staff.username} value={staff.username}>
                {staff.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Project Status</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTaskPage;
