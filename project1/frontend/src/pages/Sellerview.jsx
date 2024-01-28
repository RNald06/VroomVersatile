import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SellCar from './SellCar';

const Home = () => {
  const [cars, setCar] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const navigate = useNavigate();
  const [showSellCar, setShowSellCar] = useState(false);

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
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleType = (e) => {
    setType(e.target.value);
  };
  const handleLogoutClick = () => {
    navigate("/homepage");
    
  };
  const handleHomeClick = () => {
    window.location.reload();
  };
  const handleSellCarClick = () => {
    setShowSellCar(true);
  };
  const handleDelete= async(id)=>{
    try{
        const res= await axios.delete("http://localhost:8800/car/" +id)
        window.location.reload()
        setCar(res.data)
    }catch(err)
    {
        console.log(err)
    }
}
  const filteredCars = cars.filter((car) => {
    return (
      car &&
      car.prod_name &&
      car.prod_name.toLowerCase().includes(search.toLowerCase()) &&
      (type === "All" || car.type === type)
    );
  });
  return (
    <div className="home">
      <Header />
      <div className="header">
      <Link onClick={handleHomeClick} className="clickable">
          Home
        </Link>
        <Link onClick={handleSellCarClick} className="clickable">
          Sell Car
        </Link>
        <select className="type-dropdown" onChange={handleType}>
          <option value="All">All</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Minivan">Minivan</option>
          <option value="Wagons">Wagons</option>
          <option value="Coupes">Coupes</option>
          <option value="Convertible">Convertible</option>
          <option value="Electric Car">Electric Car</option>
          <option value="Supercar">Sports Car</option>
        </select>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by name"
          onChange={handleSearch}
        />
        <button onClick={handleLogoutClick} className="logout-button">
          Logout
        </button>
      </div>
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
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => {
              return (
                <tr key={car.id}>
                  <td>{car.prod_name}</td>
                  <td>{car.prod_description}</td>
                  <td>
                  <img className="carImage" src={`http://localhost:8800/${car.image}`} alt={car.prod_name} />
                  </td>
                  <td>${car.price}</td>
                  <td>{car.type}</td>
                  <td>
                    <Link className="view" to={`/details/${car.id}`}>
                      View Details
                    </Link>
                  </td>
                  <td><Link className='delete' onClick={()=>handleDelete(car.id)}>DELETE</Link><br/>
                  <Link className='update'to= {`/update/${car.id}`}>UPDATE</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {showSellCar && (
          <div className="modal">
            <SellCar />
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
