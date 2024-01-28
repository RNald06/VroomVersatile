import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddReview = () => {
  const { carid, id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState({
    customername: "",
    title: "",
    content: "",
    rating: 1,
    reviewdate: new Date().toISOString().split("T")[0],
    carid: carid || '',  // Initialize with carid from URL params
  });

  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsRes = await axios.get("http://localhost:8800/car");
        setCars(carsRes.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };
    fetchCars();
  }, [carid]);

  const handleChange = (e) => {
    setReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = {
      ...review,
      content: review.content === "" ? null : review.content,
      reviewdate: review.reviewdate || new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(`http://localhost:8800/review/car/${review.carid}`, formData);

      if (response.status === 201) {
        console.log("Review added successfully");
        navigate(`/details/${id}`);
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Unexpected error occurred");
      }
    } catch (err) {
      console.error("Error:", err.message);
      alert(err.message || "An error occurred");
    }
  };

  return (
    <div className="form">
      <h1>Add Review</h1>
      <select
        name="carid"
        onChange={handleChange}
        value={review.carid}
        disabled={carid ? true : false}
      >
        <option value="" disabled>
          Select a Car
        </option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.prod_name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Customer Name"
        onChange={handleChange}
        name="customername"
        value={review.customername}
      />
      <input
        type="text"
        placeholder="Title"
        onChange={handleChange}
        name="title"
        value={review.title}
      />
      <textarea
        placeholder="Content"
        onChange={handleChange}
        name="content"
        value={review.content}
      ></textarea>
      <input
        type="number"
        placeholder="Rating"
        onChange={handleChange}
        name="rating"
        value={review.rating}
        min="1"
        max="5"
      />

      <button onClick={handleClick}>Add Review</button>
    </div>
  );
};

export default AddReview;
