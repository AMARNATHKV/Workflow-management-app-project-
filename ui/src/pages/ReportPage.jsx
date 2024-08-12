// import React, { useState, useEffect } from 'react';

// const MonthlyReport = ({ projectId }) => {
//   const [report, setReport] = useState(null);

//   useEffect(() => {
//     fetch(`/api/report/${projectId}`)
//       .then(response => response.json())
//       .then(data => setReport(data))
//       .catch(error => console.error('Error fetching report:', error));
//   }, [projectId]);

//   if (!report) return <p>Loading report...</p>;

//   return (
//     <div className="report-container">
//       <h2>Monthly Report for {report.projectName}</h2>
//       <p>{report.month} {report.year}</p>
//       <ul>
//         {report.reportData.map((task, index) => (
//           <li key={index}>
//             <strong>Task:</strong> {task.taskName}<br />
//             <strong>Assigned To:</strong> {task.assignedTo}<br />
//             <strong>Status:</strong> {task.status}<br />
//             {task.completedDate && <><strong>Completed On:</strong> {new Date(task.completedDate).toLocaleDateString()}<br /></>}
//             {task.feedback && <><strong>Feedback:</strong> {task.feedback}<br /></>}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MonthlyReport;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';

// Register the required components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyReportPage = () => {
  const { projectId } = useParams();
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/monthly-report`, {
          headers: {
           
          },
        });
        const data = await response.json();
        if (response.ok) {
          setStatusData(data);
        } else {
          toast.error(data.error || 'Failed to fetch monthly report');
        }
      } catch (error) {
        console.error('Error fetching monthly report:', error);
        toast.error('Failed to fetch monthly report');
      }
    };

    fetchMonthlyReport();
  }, [projectId]);

  if (!statusData) {
    return <p>Loading...</p>;
  }

  if (
    statusData.pending === 0 &&
    statusData['in-progress'] === 0 &&
    statusData.completed === 0
  ) {
    return <p>No tasks found for the selected month.</p>;
  }

  const chartData = {
    labels: ['Pending', 'In-Progress', 'Completed'],
    datasets: [
      {
        label: 'Task Status',
        data: [
          statusData.pending || 0,
          statusData['in-progress'] || 0,
          statusData.completed || 0,
        ],
        backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
        borderColor: ['#e67e22', '#2980b9', '#27ae60'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Monthly Report</h1>
      <div className="w-full max-w-md mx-auto">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MonthlyReportPage;
