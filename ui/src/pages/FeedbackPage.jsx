import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FeedbackPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      toast.error('Task ID is missing');
      return;
    }

    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTask(data);
          setStatus(data.status);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to fetch task details');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        toast.error('Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback || !status) {
      toast.error('Please provide feedback and update the status.');
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ feedback, status }),
      });

      if (response.ok) {
        toast.success('Feedback and status updated successfully');
        setFeedback('');
        setStatus('');
     
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to submit feedback and update status');
      }
    } catch (error) {
      console.error('Error submitting feedback and updating status:', error);
      toast.error('Failed to submit feedback and update status');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      {task ? (
        <>
          <h1 className="text-xl font-bold mb-4">Feedback for Task: {task.title}</h1>
          <p className="mb-4">{task.description}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="feedback">
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Enter your feedback here..."
                rows="5"
                className="border p-2 w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="status">
                Update Task Status
              </label>
              <select
                id="status"
                value={status}
                onChange={handleStatusChange}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Feedback and Update Status
            </button>
          </form>
        </>
      ) : (
        <p>Task not found</p>
      )}
    </div>
  );
};

export default FeedbackPage;
