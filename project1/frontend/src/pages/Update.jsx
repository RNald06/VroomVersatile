import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate} from "react-router-dom";

const Update = () => {
  const [Car, setCar] = useState({
    prod_name: "",
    prod_description: "",
    price: "",
    image: null,
    type: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const carID = location.pathname.split("/")[2];

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setCar((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("prod_name", Car.prod_name);
    formData.append("prod_description", Car.prod_description);
    formData.append("price", Car.price === "" ? null : Car.price);
    formData.append("image", Car.image);
    formData.append("type", Car.type);

    console.log("Submitting:", formData);
    try {
      const response = await axios.put(
        `http://localhost:8800/car/${carID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response);
      navigate("/sellerview");
    } catch (err) {
      console.error("Error:", err.response.data);
      alert(err.response.data.message);
    }
  };
  const handleCloseClick = () => {
    navigate("/sellerview");
  };

  console.log(Car);

  return (
    <div className="form-box">
      <span className="close-button" onClick={handleCloseClick}>&times; </span>
        <h1>Update Item Details</h1>
        <input
          type="text"
          placeholder="name"
          onChange={handleChange}
          name="prod_name"
          value={Car.prod_name}
        />
        <input
          type="text"
          placeholder="description"
          onChange={handleChange}
          name="prod_description"
          value={Car.prod_description}
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
          value={Car.price}
        />
        <label className="type-label">
        <select className="typeko" name="type" onChange={handleChange} value={Car.type}>
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

        <button className="form-button" onClick={handleClick}>
          Update Item
        </button>
      </div>
  );
};

export default Update;
