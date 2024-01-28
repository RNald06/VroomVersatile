import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRes = await axios.get('http://localhost:8800/review');
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="review-table-container">
      <h3>All Customer Reviews</h3>
      <table className="review-table">
        <thead>
          <tr>
            <th>Car ID</th>
            <th>Customer Name</th>
            <th>Title</th>
            <th>Content</th>
            <th>Rating</th>
            <th>Review Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.reviewid}>
              <td>{review.carid}</td>
              <td>{review.customername}</td>
              <td>{review.title}</td>
              <td>{review.content}</td>
              <td>{review.rating}</td>
              <td>{review.reviewdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;
