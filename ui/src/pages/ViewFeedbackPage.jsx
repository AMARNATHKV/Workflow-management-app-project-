import React, { useEffect, useState } from 'react';

const ViewFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Adjust the URL if necessary based on your API endpoint
        const response = await fetch('/api/feedback/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
           
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        setError('Error fetching feedbacks');
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-gray-100 p-8 text-black">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-red-600 mb-8">Feedback History</h2>
        {error && <p className="text-red-600">{error}</p>}
        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-md">
                
                <p className="text-gray-600">Feedback: {feedback.feedback}</p>
                <p className="text-gray-600">Created At: {new Date(feedback.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No feedbacks available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewFeedbackPage;

