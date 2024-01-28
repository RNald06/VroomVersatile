import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import SellCar from "./pages/SellCar";
import Update from "./pages/Update";
import Login from "./pages/Login";
import Sellerlogin from "./pages/Sellerlogin";
import SellerSignup from "./pages/SellerSignup";  
import Signup from "./pages/Signup"; 
import Homepage from "./pages/Homepage";
import Sellerview from "./pages/Sellerview";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Review from "./pages/Review";
import ReviewList from "./pages/ReviewList";
import DetailsHome from "./pages/DetailsHome";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import "./style.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/sellcar" element={<SellCar />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/Sellerlogin" element={<Sellerlogin />} />
          <Route path="/SellerSignup" element={<SellerSignup />} />  
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/sellerview" element={<Sellerview />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/Review" element={<Review />} />
          <Route path="/ReviewList" element={<ReviewList />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/detailshome/:id" element={<DetailsHome />} />
          <Route path="/header" element={<Header />} /> 
          <Route path="/footer" element={<Footer />} />  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
