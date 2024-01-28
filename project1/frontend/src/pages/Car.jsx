import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'; 
const Car =()=>{

    const [car, setCar]=useState([])

    useEffect(()=>{
        const fetchAllCar= async()=>{
            try{
                const res= await axios.get("http://localhost:8800/car")
                setCar(res.data)
            }catch(err)
            {
                console.log(err)
            }
        }
        fetchAllCar()
    },[])

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

    return(
        <div> 
            <h1>Marketplace</h1>
            <div className= 'car'></div>
            {car.map((car)=>(
                <div className='car' key={car.id}>
                <img className="carImage" src={`http://localhost:8800/${car.image}`} alt={car.prod_name} />
                <h2>{car.prod_name}</h2>
                <p>{car.prod_description}</p>
                <span>{car.price}</span>
                <span>{car.type}</span>
                <button className='delete' onClick={()=>handleDelete(car.id)}>DELETE</button>
                <button className='update'><Link to= {`/update/${car.id}`}>UPDATE</Link></button>
                    </div>
            ))}
            <button>
                <Link to="/add">ADD NEW ITEM</Link>
            </button>
        </div>
    )
}

export default Car