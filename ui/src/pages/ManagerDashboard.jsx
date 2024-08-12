import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', {
          headers: {
          
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch projects');
        }

        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error(error.message || 'Error fetching projects');
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = (pid) => {
    navigate(`/view-project/${pid}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
      {projects.length > 0 ? (
        <div>
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleViewDetails(project._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default ManagerDashboard;
