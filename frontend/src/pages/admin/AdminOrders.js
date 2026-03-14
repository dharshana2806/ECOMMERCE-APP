import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { FaCheck, FaTruck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['adminOrders', statusFilter], () => 
    ordersAPI.getAll({ status: statusFilter })
  );

  const deliverMutation = useMutation(ordersAPI.updateToDelivered, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminOrders');
      toast.success('Order marked as delivered');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  });

  const orders = data?.data?.data?.orders || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <Helmet>
        <title>Manage Orders - Admin</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {order.orderStatus === 'Processing' && (
                      <button
                        onClick={() => {
                          // In a real app, you might want to update to shipped first
                          // For simplicity, we'll just mark as delivered here
                          deliverMutation.mutate(order._id);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as Delivered"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {order.orderStatus === 'Shipped' && (
                      <button
                        onClick={() => deliverMutation.mutate(order._id)}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as Delivered"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {/* You can add more actions like cancel, etc. */}
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

export default AdminOrders;