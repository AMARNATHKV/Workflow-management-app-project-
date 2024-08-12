// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const Logout = () => {
//   const navigate = useNavigate();
//   const logout = async () => {
//     try {
//       const res = await fetch("/api/logout");
//       if (res.ok) {
//         toast.success("Logout success");
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     }
//   };

//   return <button onClick={logout}>Logout</button>;
// };

// export default Logout;
import Cookies from 'js-cookie';

export const handleLogout = async (navigate) => {
  try {
    const response = await fetch('/logout', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      localStorage.removeItem('token');
      Cookies.remove('Authtoken');
      navigate('/login');
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('An error occurred during logout:', error);
  }
};
