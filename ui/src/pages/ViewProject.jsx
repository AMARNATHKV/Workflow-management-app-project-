// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const ViewProjectPage = () => {
//   const { projectId } = useParams();
//   // console.log(projrctId)
//   console.log(projectId);
  
//   const [project, setProject] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         const response = await fetch(`/api/projects/id/${projectId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//           credentials:'include',
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setProject(data);
//           console.log('Fetched project data:', data);
//         } else {
//           toast.error(data.error || 'Failed to fetch project details');
//         }
//       } catch (error) {
//         console.error('Error fetching project details:', error);
//         toast.error('Failed to fetch project details');
//       }
//     };

//     fetchProjectDetails();
//   }, [projectId]);

//   if (!project) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Project Name : {project.name}</h1>
//       <p className="mb-4 text-xl">Description : {project.description}</p>
      
//       <h2 className="text-xl font-semibold mb-2">Assigned Staff</h2>
//       {project.invitestaff && project.invitestaff.length > 0 ? (
//         <ul className="list-disc pl-5 mb-4">
//           {project.invitestaff.map((staffMember, index) => (
//             <li key={index} className="mb-1">
//               {staffMember.username} <span className={`font-semibold ${staffMember.invitationStatus === 'accepted' ? 'text-green-500' : 'text-yellow-500'}`}>
//                 {staffMember.invitationStatus}
//               </span>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No staff assigned.</p>
//       )}
    
//       <div className="mt-4">
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//           onClick={() => navigate(`/add-task/${projectId}`)}
//         >
//           Add Task
//         </button>

//         <button
        
//           className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//           onClick={() => navigate(`/view-task/${projectId}`)}
//         >
//           View Task
//         </button>

//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//           onClick={() => navigate(`/edit-project/${projectId}`)}
//         >
//           Edit Project
//         </button>

//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//           onClick={() => navigate(`/monthly-report/${projectId}`)}
//         >
//           Monthly Report
//         </button>

//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded"
//           onClick={async () => {
//             try {
//               const confirm = window.confirm("Sure want to delete?!");
//               if (!confirm) return;
//               const res = await fetch(`/api/projects/${project._id}`, {
//                 method: 'DELETE',
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//               });
//               if (res.ok) {
//                 toast.success('Project removed successfully');
//                 navigate('/manager-dashboard')
//               }
//             } catch (error) {
//               console.error('Error removing project:', error);
//               toast.error('Failed to remove project');
//             }
//           }}
//         >
//           Remove Project
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewProjectPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/projects/id/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setProject(data);
          console.log('Fetched project data:', data);
        } else {
          toast.error(data.error || 'Failed to fetch project details');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error('Failed to fetch project details');
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (!project) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-lg mb-6">{project.description}</p>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Assigned Staff</h2>
        {project.invitestaff && project.invitestaff.length > 0 ? (
          <ul className="list-disc pl-5">
            {project.invitestaff.map((staffMember, index) => (
              <li key={index} className="mb-2">
                {staffMember.username}{' '}
                <span className={`font-semibold ${staffMember.invitationStatus === 'accepted' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {staffMember.invitationStatus}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No staff assigned.</p>
        )}
      </div>
    
      <div className="flex gap-4">
        <button
          className="bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700 transition"
          onClick={() => navigate(`/add-task/${projectId}`)}
        >
          Add Task
        </button>

        <button
          className="bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700 transition"
          onClick={() => navigate(`/view-task/${projectId}`)}
        >
          View Task
        </button>


        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate(`/monthly-report/${projectId}`)}
        >
          Monthly Report
        </button>

        <button
          className="bg-red-600 text-white px-5 py-3 rounded-lg shadow hover:bg-red-700 transition"
          onClick={async () => {
            try {
              const confirm = window.confirm("Are you sure you want to delete this project?");
              if (!confirm) return;
              const res = await fetch(`/api/projects/${project._id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              if (res.ok) {
                toast.success('Project removed successfully');
                navigate('/manager-dashboard');
              }
            } catch (error) {
              console.error('Error removing project:', error);
              toast.error('Failed to remove project');
            }
          }}
        >
          Remove Project
        </button>
      </div>
    </div>
  );
};

export default ViewProjectPage;
