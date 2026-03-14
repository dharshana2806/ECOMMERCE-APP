import React from 'react';
import { useQuery } from 'react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

// This is a placeholder since user management API wasn't implemented
// You would need to create user routes and controller similar to products/orders
const AdminUsers = () => {
  // For demonstration, we'll show static data
  // In a real app, you'd fetch from an API

  const dummyUsers = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2024-03-01' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', createdAt: '2024-02-15' },
    { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: '2024-03-10' },
  ];

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyUsers.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{user._id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;