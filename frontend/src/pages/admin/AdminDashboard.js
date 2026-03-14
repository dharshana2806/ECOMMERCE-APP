import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI, productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { FaBox, FaShoppingCart, FaUsers, FaStar } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: ordersData, isLoading: ordersLoading } = useQuery('adminOrders', ordersAPI.getAll);
  const { data: productsData, isLoading: productsLoading } = useQuery('adminProducts', productsAPI.getAll);

  if (ordersLoading || productsLoading) return <LoadingSpinner fullScreen />;

  const orders = ordersData?.data?.data?.orders || [];
  const products = productsData?.data?.data?.products || [];

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
  const totalUsers = 100; // You can fetch from an API if you implement user management

  const stats = [
    { label: 'Total Products', value: products.length, icon: FaBox, color: 'bg-blue-500' },
    { label: 'Total Orders', value: orders.length, icon: FaShoppingCart, color: 'bg-green-500' },
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: FaStar, color: 'bg-yellow-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: FaUsers, color: 'bg-red-500' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - E-Shop</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white mr-4`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
            <FaBox className="text-4xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Manage Products</h3>
            <p className="text-sm text-gray-500">Add, edit, or remove products</p>
          </Link>
          <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
            <FaShoppingCart className="text-4xl text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Manage Orders</h3>
            <p className="text-sm text-gray-500">View and update order status</p>
          </Link>
          <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
            <FaUsers className="text-4xl text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-gray-500">View and manage user accounts</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-2">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-2">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;