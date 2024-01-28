import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const Details = () => {
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ customername: '', title: '', content: '', rating: 0 });
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carRes = await axios.get(`http://localhost:8800/car/${id}`);
        setCar(carRes.data);
        const reviewsRes = await axios.get(`http://localhost:8800/review/car/${id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleRatingChange = (e) => {
    const rating = parseInt(e.target.value, 10);
    setNewReview((prevReview) => ({ ...prevReview, rating }));
  };

  const handleAddReview = async () => {
    try {
      // Add the review to the database with the current date
      const currentDate = new Date().toISOString().split('T')[0];
      const reviewData = { ...newReview, reviewdate: currentDate };
      await axios.post(`http://localhost:8800/review/car/${id}`, reviewData);

      // Fetch and update the reviews for that car
      const reviewsRes = await axios.get(`http://localhost:8800/review/car/${id}`);
      setReviews(reviewsRes.data);

      // Clear the newReview state
      setNewReview({ customername: '', title: '', content: '', rating: 0 });
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  return (
    <div className="home">
      <Header />
      {car ? (
        <div className="details-content">
          <h1 className="details-title">{car.prod_name}</h1>
          <img className="details-carImage" src={`http://localhost:8800/${car.image}`} alt={car.prod_name} />
          <h2 className="details-description">{car.prod_description}</h2>
          <p className="details-type">Type: {car.type}</p>
          <p className="details-price">Price: ${car.price}</p>

          <div className="details-reviews">
            <h3 className="details-reviews-title">Customer Reviews</h3>
            {reviews.length > 0 ? (
              <table className="details-review-table">
                <thead>
                  <tr>
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
                      <td>{review.customername}</td>
                      <td>{review.title}</td>
                      <td>{review.content}</td>
                      <td>{review.rating}</td>
                      <td>{review.reviewdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="details-no-reviews">No reviews for this car yet.</p>
            )}
          </div>
          <div className="details-reviews-title">
          <h3>Add Review</h3>
          <table className="add-review-table">
          <tbody>
            <tr>
                <th>Customer Name</th>
                <th>Title</th>
                <th>Content</th>
                <th>Rating</th>
                <th>Function</th>
            </tr>
            <tr>
                <td>
                    <input type="text" name="customername" value={newReview.customername} onChange={handleInputChange} />
                </td>
                <td>
                    <input type="text" name="title" value={newReview.title} onChange={handleInputChange} />
                </td>
                <td>
                    <input type="text" name="content" value={newReview.content} onChange={handleInputChange} />
                </td>
                <td>
                    <select name="rating" value={newReview.rating} onChange={handleRatingChange}>
                      {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                      {value}
              </option>
            ))}
          </select>
        </td>
        <td>
        <button onClick={handleAddReview}>Add Review</button>
      </td>
      </tr>
    </tbody>
  </table>
</div>
        </div>
      ) : (
        <p className="details-loading">Loading...</p>
      )}
      <Footer />
    </div>
  );
};

export default Details;
