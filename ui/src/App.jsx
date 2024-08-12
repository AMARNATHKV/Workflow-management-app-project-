// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ProfilePage from "./pages/ProfilePage";
//import ProjectDetails from "./pages/ProjectDetails";
import AddProjectPage from "./pages/AddProjectPage";
import AddTaskPage from "./pages/AddTaskPage";
import HomePage from "./pages/HomePage"
import ViewProjectPage from "./pages/ViewProject";

import ViewTaskPage from "./pages/ViewTaskPage";
import FeedbackPage from "./pages/FeedbackPage";
import ViewFeedbackPage from "./pages/ViewFeedbackPage";
import ReportPage from "./pages/ReportPage";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route index element={<HomePage />} />
        <Route path="/" element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-project" element={<AddProjectPage />} />
          <Route path="/add-task/:projectId" element={<AddTaskPage />} /> 
       
          <Route path="/view-project/:projectId" element={<ViewProjectPage />} />
        
          
          <Route path="/view-task/:id" element={<ViewTaskPage />} />
          <Route path="/feedback/:projectId/:taskId" element={<FeedbackPage />} />
          <Route path="/task-feedback" element={<ViewFeedbackPage />} />
          <Route path="monthly-report/:projectId" element={<ReportPage />} />
        </Route>


      </Routes>
    </Router>
  );
};

export default App;
