import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProjectPage = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [staffUsernames, setStaffUsernames] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectDetails = {
      name: projectName,
      description,
      invitestaff: staffUsernames.split(",").map((name) => name.trim()),
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        
        },
        body: JSON.stringify(projectDetails),
      });

      if (res.ok) {
        toast.success("Project added successfully");
        navigate("/manager-dashboard");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to add project");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-blue-100 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-bold text-blue-700 mb-3 text-center">
          Add Project
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label
              htmlFor="projectName"
              className="block text-gray-700 font-bold mb-1"
            >
              Project Name:
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-2 py-1 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2 py-1 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="staffUsernames"
              className="block text-gray-700 font-bold mb-1"
            >
              Staff Usernames (comma separated):
            </label>
            <input
              type="text"
              id="staffUsernames"
              name="staffUsernames"
              value={staffUsernames}
              onChange={(e) => setStaffUsernames(e.target.value)}
              className="w-full px-2 py-1 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-center mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPage;
