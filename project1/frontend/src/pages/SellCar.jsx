import React, { useState } from "react";
import axios from "axios";

const SellCar = () => {
  const [car, setCar] = useState({
    prod_name: "",
    prod_description: "",
    price: "",
    image: null,
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm] = useState(true);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setCar((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      for (const key in car) {
        formData.append(key, car[key]);
      }

      const response = await axios.post("http://localhost:8800/car", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response);
      window.location.reload();
    } catch (err) {
      console.error('Error:', err.response.data);
      setError(err.response.data.message || 'An error occurred during the image upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = () => {
    window.location.reload();
  };

  return (
    <div className={`form-box ${showForm ? '' : 'hidden'}`}>
      <span className="close-button" onClick={handleCloseClick}>&times; </span>
      <h1>ADD NEW ITEM</h1>
      <input
        type="text"
        placeholder="name"
        onChange={handleChange}
        name="prod_name"
        value={car.prod_name}
      />
      <input
        type="text"
        placeholder="description"
        onChange={handleChange}
        name="prod_description"
        value={car.prod_description}
      />
      <input
        type="file"
        placeholder="image"
        onChange={handleChange}
        name="image"
      />
      <input
        type="number"
        placeholder="price"
        onChange={handleChange}
        name="price"
        value={car.price}
      />
      <label className="type-label">
        <select className="typeko" name="type" onChange={handleChange} value={car.type}>
          <option value="" disabled>Select a type</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Minivan">Minivan</option>
          <option value="Wagons">Wagons</option>
          <option value="Coupes">Coupes</option>
          <option value="Convertible">Convertible</option>
          <option value="Electric Car">Electric Car</option>
          <option value="Sports Car">Sports Car</option>
        </select>
      </label>

      {loading && <p>Uploading image...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleClick} disabled={loading}>
        SELL ITEM
      </button>
    </div>
  );
};

export default SellCar;
