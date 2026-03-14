import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => productsAPI.getById(id)
  );

  const reviewMutation = useMutation(
    (reviewData) => productsAPI.createReview(id, reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['product', id]);
        setReview({ rating: 5, comment: '' });
        toast.success('Review submitted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      }
    }
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data?.data?.success) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-red-600">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">
          Back to Products
        </button>
      </div>
    );
  }

  const product = data.data.data;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (product.stock < quantity) {
      toast.error('Insufficient stock');
      return;
    }
    addToCart(product._id, quantity);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }
    reviewMutation.mutate(review);
  };

  const averageRating = product.ratings || 0;
  const reviewCount = product.numOfReviews || 0;

  return (
    <>
      <Helmet>
        <title>{product.name} - E-Shop</title>
      </Helmet>

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span> {'>'}
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/products')}>Products</span> {'>'}
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span> {'>'}
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
        <div>
     <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {product.images && product.images.length > 0 ? (
      <img
        src={product.images[0].url}
        alt={product.name}
        className="w-full h-96 object-contain"
      />
    ) : (
      <img
  src={product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/600?text=No+Image'}
  alt={product.name}
  className="w-full h-96 object-contain"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/600?text=No+Image';
  }}
/>
    )}
  </div>
  {/* thumbnail images section - you can also update similarly */}
</div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-600">({reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-500 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600">✅ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">❌ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex items-center px-6 py-2"
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
                <button className="btn-secondary p-2">
                  <FaHeart />
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {product.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">SKU:</span> {product._id}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                  className="input-field w-32"
                >
                  {[5,4,3,2,1].map(num => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  rows="4"
                  className="input-field"
                  placeholder="Share your experience with this product..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" disabled={reviewMutation.isLoading}>
                {reviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((rev, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < rev.rating ? 'text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="font-semibold">{rev.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;