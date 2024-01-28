import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 
import Footer from "./Footer";

const Add = () => {
  const [Reviews, setReviews] = useState({
    CustomerName: "",
    Title: "",
    Content: "", 
    Rating: "",
    ReviewDate: "",
  });
  const [cars, setCar] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleType = (e) => {
    setType(e.target.value);
  };
  
  useEffect(() => {
    const fetchAllCar = async () => {
      try {
        const res = await axios.get("http://localhost:8800/car");
        setCar(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCar();
  }, []);

  const filteredCars = cars.filter((car) => {
    return (
      car.prod_name.toLowerCase().includes(search.toLowerCase()) &&
      (type === "All" || car.type === type || (type === "Car" && car.type !== "Motorcycle"))
    );
  });
  
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8800/review");
        setReviews(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllReviews();
  }, []);
  

  const navigate = useNavigate();

  const handleChange = (e) => {
    setReviews((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const formData = {
      ...Reviews,
      price: Reviews.Rating === "" ? null : Reviews.Rating, 
    };
    console.log('Submitting:', formData); 
    try {
      const response = await axios.post("http://localhost:8800/reviews", formData);
      console.log('Response:', response);
      navigate("/details");
    } catch (err) {
      console.error('Error:', err.response.data); 
      alert(err.response.data.message);
    }
  };
  console.log(Reviews);
  return (
    <div className="form">
        <Header/>
      <h1>ADD NEW ITEM</h1>
      <input
        type="text"
        placeholder="name"
        onChange={handleChange}
        name="prod_name"
        value={Reviews.CustomerName}
      />
      <input
        type="text"
        placeholder="description"
        onChange={handleChange}
        name="prod_description"
        value={Reviews.Title}
      />
      <input
        type="text"
        placeholder="image"
        onChange={handleChange}
        name="image"
        value={Reviews.Content}
      />
      <input
        type="number"
        placeholder="price"
        onChange={handleChange}
        name="price"
        value={Reviews.Rating}
      
      />
      <div className="body">
        <table className="car-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Price</th>
              <th>Type</th>
              <th>Info</th> 
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => {
              return (
                <tr key={car.id}>
                  <td>{car.prod_name}</td>
                  <td>{Reviews.CustomerName}</td>
                  <td>{Reviews.Title}</td>
                  <td>{Reviews.Content}</td>
                  <td>{Reviews.Rating}</td>
                  <td>{Reviews.ReviewDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

      <button onClick={handleClick}>ADD MO NA</button>
      <Footer/>
    </div>
  );
};

export default Add;
