import express from "express";
import fileUpload from "express-fileupload";
import mysql from "mysql";
import cors from "cors";
import path from "path";
const app = express();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nald@0627',
  database: 'marketplace',
  insecureAuth: true,
});
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/public', express.static('public'));
app.get("/", (req, res)=>{
  res.json("this is the backend")
})
app.post("/login/buyer", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT * FROM buyer WHERE username = ? AND password = ?";
  db.query(q, [username, password], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    if (data.length > 0) {
      return res.status(200).json({ message: "Buyer login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials for buyer" });
    }
  });
});
app.post("/login/seller", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT * FROM seller WHERE username = ? AND password = ?";
  db.query(q, [username, password], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    if (data.length > 0) {
      return res.status(200).json({ message: "Seller login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials for seller" });
    }
  });
});
app.post("/signup", (req, res) => {
  const { username, password, name, userType } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ message: "Username, password, and name are required" });
  }

  let tableName, extraField;
  if (userType === "buyer") {
    tableName = "buyer";
    extraField = "name";
  } else if (userType === "seller") {
    tableName = "seller";
    extraField = "name";
  } else {
    return res.status(400).json({ message: "Invalid user type" });
  }
  const checkUserQuery = `SELECT * FROM ${tableName} WHERE username = ?`;
  db.query(checkUserQuery, [username], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    if (data.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    } else {
      const insertUserQuery = `INSERT INTO ${tableName} (\`username\`, \`password\`, \`${extraField}\`) VALUES (?, ?, ?)`;
      db.query(insertUserQuery, [username, password, name], (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error", error: err });
        }
        return res.status(201).json({ message: "User registered successfully" });
      });
    }
  });
});
app.get("/car", (req, res)=>{
  const q= "SELECT * FROM car"
  db.query(q,(err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  } )
})
app.get("/upload/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'public', 'upload', filename));
});
app.get("/review", (req, res) => {
  const q = "SELECT * FROM review";
  
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/car", (req, res) => {
  const { prod_name, prod_description, price, type } = req.body;
  const { image } = req.files;

  if (!image) {
    return res.status(400).json({ message: "No image provided" });
  }

  const imagePath = `public/upload/${image.name}`;
  image.mv(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving image" });
    }

    const q = "INSERT INTO car (`prod_name`, `prod_description`, `price`, `type`, `image`) VALUES (?, ?, ?, ?, ?)";
    const values = [prod_name, prod_description, price, type, imagePath];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err });
      }
      return res.status(201).json({ message: "Car added successfully" });
    });
  });
});
app.delete("/car/:id",(req,res)=>{
  const carID= req.params.id;
  const q= "DELETE FROM car WHERE id= ?"

  db.query(q, carID, (err, data) => { 
      if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error", error: err });
      }
      return res.status(201).json({ message: "Car Deleted" });
  });

})
app.post("/review/car/:carid", (req, res) => {
  const q = "INSERT INTO review (`carid`, `customername`, `title`, `content`, `rating`, `reviewdate`) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    req.params.carid,
    req.body.customername,
    req.body.title,
    req.body.content,
    req.body.rating,
    req.body.reviewdate,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Error inserting review:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    return res.status(201).json({ message: "Review added successfully" });
  });
});
app.put("/review/car/:carid", (req, res) => {
  const q = "UPDATE review SET `customername`=?, `title`=?, `content`=?, `rating`=?, `reviewdate`=? WHERE reviewid=?";
  const values = [
    req.body.customername,
    req.body.title,
    req.body.content,
    req.body.rating,
    req.body.reviewdate,
    req.params.id,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    return res.status(201).json({ message: "Review updated successfully" });
  });
});
app.put("/car/:id", (req, res) => {
  const carID = req.params.id;
  const { prod_name, prod_description, price, type } = req.body;
  const { image } = req.files;

  let imagePath;

  if (image) {
    // If a new image is provided, upload it and update the imagePath
    imagePath = `public/upload/${image.name}`;
    image.mv(imagePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving image" });
      }
    });
  }

  const q = `UPDATE car SET 
    prod_name = ?, 
    prod_description = ?, 
    ${image ? "image = ?," : ""} 
    price = ?, 
    type = ? 
    WHERE id = ?`;

  const values = [prod_name, prod_description, image ? imagePath : null, price, type, carID];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    return res.status(201).json({ message: "Car Updated" });
  });
});
app.get("/car/:id", (req, res) => {
  const q = `SELECT * FROM car WHERE id = ?`;
  const carID = req.params.id;

  db.query(q, [carID], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    if (data.length > 0) {
      return res.status(200).json(data[0]);
    } else {
      return res.status(404).json({ message: "Car not found" });
    }
  });
});
app.get("/review/car/:carid", (req, res) => {
  const carID = req.params.carid;
  const q = "SELECT * FROM review WHERE carid = ?";

  db.query(q, [carID], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "No reviews found for this car" });
    }
  });
});
app.listen(8800, () => {
  console.log("connected to backend");
});
