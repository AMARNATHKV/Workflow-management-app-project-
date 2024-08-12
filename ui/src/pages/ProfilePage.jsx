// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// const ProfilePage = () => {
//   const [user, setUser] = useState({
//     username: '',
//     email: '',
//     userType: '',
//   });
//   const [newPassword, setNewPassword] = useState('');

//   useEffect(() => {
//     // Fetch user profile from the server
//     fetch('/api/profile', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       setUser(data);
//     })
//     .catch(error => {
//       console.error('Error fetching profile:', error);
//       toast.error('Error fetching profile');
//     });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     fetch('/api/profile', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({ 
//         username: user.username, 
//         password: newPassword, 
//         userType: user.userType 
//       }),
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       toast.success('Profile updated successfully');
//     })
//     .catch(error => {
//       console.error('Error updating profile:', error);
//       toast.error('Error updating profile');
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser(prevUser => ({
//       ...prevUser,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={user.username || ''} // Ensure the value is never undefined
//             onChange={handleChange}
//             className="mt-1 p-2 border rounded-md w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             value={user.email || ''} // Ensure the value is never undefined
//             readOnly
//             className="mt-1 p-2 border rounded-md w-full bg-gray-200"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">User Type</label>
//           <select
//             name="userType"
//             value={user.userType || ''} // Ensure the value is never undefined
//             onChange={handleChange}
//             className="mt-1 p-2 border rounded-md w-full"
//           >
//             <option value="manager">Manager</option>
//             <option value="staff">Staff</option>
//           </select>
//         </div>
      
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Update Profile</button>
//       </form>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    userType: '',
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error fetching profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ 
          username: user.username, 
          password: newPassword, 
          userType: user.userType 
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated successfully');

      // Optionally, fetch profile data again to reflect updates
      const updatedResponse = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!updatedResponse.ok) throw new Error('Failed to fetch updated profile');
      const updatedData = await updatedResponse.json();
      setUser(updatedData);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={user.username || ''} // Ensure the value is never undefined
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email || ''} // Ensure the value is never undefined
            readOnly
            className="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
      
      </form>
    </div>
  );
};

export default ProfilePage;
