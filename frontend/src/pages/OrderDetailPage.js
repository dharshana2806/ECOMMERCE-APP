import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(['order', id], () => ordersAPI.getById(id));

  const cancelMutation = useMutation(
    () => ordersAPI.cancel(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', id]);
        toast.success('Order cancelled successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data?.data?.success) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-red-600">Order not found</h2>
        <button onClick={() => navigate('/orders')} className="btn-primary mt-4">Back to Orders</button>
      </div>
    );
  }

  const order = data.data.data;

  const canCancel = ['Processing', 'Confirmed'].includes(order.orderStatus) && !order.isDelivered;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600';
      case 'Shipped': return 'text-blue-600';
      case 'Processing': return 'text-yellow-600';
      case 'Cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      <Helmet>
        <title>Order #{order._id} - E-Shop</title>
      </Helmet>

      <div className="container-custom py-8 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order #{order._id}</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)} bg-opacity-10 ${order.orderStatus === 'Delivered' ? 'bg-green-100' : order.orderStatus === 'Shipped' ? 'bg-blue-100' : order.orderStatus === 'Processing' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Shipping Address */}
            <div>
              <h2 className="font-semibold mb-2">Shipping Address</h2>
              <p className="text-gray-600">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}<br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            {/* Payment Info */}
            <div>
              <h2 className="font-semibold mb-2">Payment Information</h2>
              <p className="text-gray-600">
                Method: {order.paymentMethod}<br />
                Status: {order.isPaid ? 'Paid' : 'Not Paid'}<br />
                {order.isPaid && <span>Paid on {new Date(order.paidAt).toLocaleDateString()}</span>}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                  <div className="w-16 h-16 bg-gray-200 rounded">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          {canCancel && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    cancelMutation.mutate();
                  }
                }}
                className="btn-danger"
                disabled={cancelMutation.isLoading}
              >
                {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;