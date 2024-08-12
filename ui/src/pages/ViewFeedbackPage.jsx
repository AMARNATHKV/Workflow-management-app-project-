import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
       console.log("test1")
        const response = await fetch('/task-feedback', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
       console.log("test2")
        console.log(response)
        const data = await response.json();
        console.log(data)
        setFeedbacks(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

 
  return (
    <div className="bg-gray-100 p-8 text-black">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-red-600 mb-8">Appointment History</h2>
        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback) => {
             

              return (
                <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-md">
              
                  <p className="text-gray-600">TaskId: {feedback.taskId}</p>
                  <p className="text-gray-600">Feedback: {feedback.feedback}</p>
                  <p  className="text-gray-600" >Created At: {new Date(feedback.createdAt).toLocaleString()}</p>
                
                  
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">No feedbacks available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewFeedbackPage;