import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaCheckCircle, FaPrint, FaEnvelope } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery(['order', id], () => ordersAPI.getById(id));

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data?.data?.success) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-red-600">Order not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
      </div>
    );
  }

  const order = data.data.data;

  return (
    <>
      <Helmet>
        <title>Order Confirmation - E-Shop</title>
      </Helmet>

      <div className="container-custom py-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>

          <div className="border-t border-b py-4 my-6">
            <p className="text-lg">
              <span className="font-semibold">Order Number:</span> #{order._id}
            </p>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="text-left mb-6">
            <h2 className="font-semibold mb-2">Order Summary</h2>
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm py-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-left mb-6">
            <h2 className="font-semibold mb-2">Shipping Address</h2>
            <p className="text-gray-600">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              <br />Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.print()}
              className="btn-secondary flex items-center"
            >
              <FaPrint className="mr-2" /> Print Receipt
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary flex items-center"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;