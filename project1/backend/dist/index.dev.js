"use strict";

var _express = _interopRequireDefault(require("express"));

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _mysql = _interopRequireDefault(require("mysql"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var db = _mysql["default"].createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nald@0627',
  database: 'marketplace',
  insecureAuth: true
});

app.use(_express["default"].json());
app.use((0, _cors["default"])());
app.use((0, _expressFileupload["default"])());
app.use('/public', _express["default"]["static"]('public'));
app.get("/", function (req, res) {
  res.json("this is the backend");
});
app.post("/login/buyer", function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  var q = "SELECT * FROM buyer WHERE username = ? AND password = ?";
  db.query(q, [username, password], function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        message: "Buyer login successful"
      });
    } else {
      return res.status(401).json({
        message: "Invalid credentials for buyer"
      });
    }
  });
});
app.post("/login/seller", function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;
  var q = "SELECT * FROM seller WHERE username = ? AND password = ?";
  db.query(q, [username, password], function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        message: "Seller login successful"
      });
    } else {
      return res.status(401).json({
        message: "Invalid credentials for seller"
      });
    }
  });
});
app.post("/signup", function (req, res) {
  var _req$body3 = req.body,
      username = _req$body3.username,
      password = _req$body3.password,
      name = _req$body3.name,
      userType = _req$body3.userType;

  if (!username || !password || !name) {
    return res.status(400).json({
      message: "Username, password, and name are required"
    });
  }

  var tableName, extraField;

  if (userType === "buyer") {
    tableName = "buyer";
    extraField = "name";
  } else if (userType === "seller") {
    tableName = "seller";
    extraField = "name";
  } else {
    return res.status(400).json({
      message: "Invalid user type"
    });
  }

  var checkUserQuery = "SELECT * FROM ".concat(tableName, " WHERE username = ?");
  db.query(checkUserQuery, [username], function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    if (data.length > 0) {
      return res.status(409).json({
        message: "Username already exists"
      });
    } else {
      var insertUserQuery = "INSERT INTO ".concat(tableName, " (`username`, `password`, `").concat(extraField, "`) VALUES (?, ?, ?)");
      db.query(insertUserQuery, [username, password, name], function (err, data) {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Internal Server Error",
            error: err
          });
        }

        return res.status(201).json({
          message: "User registered successfully"
        });
      });
    }
  });
});
app.get("/car", function (req, res) {
  var q = "SELECT * FROM car";
  db.query(q, function (err, data) {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/upload/:filename", function (req, res) {
  var filename = req.params.filename;
  res.sendFile(_path["default"].join(__dirname, 'public', 'upload', filename));
});
app.get("/review", function (req, res) {
  var q = "SELECT * FROM review";
  db.query(q, function (err, data) {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/car", function (req, res) {
  var _req$body4 = req.body,
      prod_name = _req$body4.prod_name,
      prod_description = _req$body4.prod_description,
      price = _req$body4.price,
      type = _req$body4.type;
  var image = req.files.image;

  if (!image) {
    return res.status(400).json({
      message: "No image provided"
    });
  }

  var imagePath = "public/upload/".concat(image.name);
  image.mv(imagePath, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error saving image"
      });
    }

    var q = "INSERT INTO car (`prod_name`, `prod_description`, `price`, `type`, `image`) VALUES (?, ?, ?, ?, ?)";
    var values = [prod_name, prod_description, price, type, imagePath];
    db.query(q, values, function (err, data) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Internal Server Error",
          error: err
        });
      }

      return res.status(201).json({
        message: "Car added successfully"
      });
    });
  });
});
app["delete"]("/car/:id", function (req, res) {
  var carID = req.params.id;
  var q = "DELETE FROM car WHERE id= ?";
  db.query(q, carID, function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    return res.status(201).json({
      message: "Car Deleted"
    });
  });
});
app.post("/review/car/:carid", function (req, res) {
  var q = "INSERT INTO review (`carid`, `customername`, `title`, `content`, `rating`, `reviewdate`) VALUES (?, ?, ?, ?, ?, ?)";
  var values = [req.params.carid, req.body.customername, req.body.title, req.body.content, req.body.rating, req.body.reviewdate];
  db.query(q, values, function (err, data) {
    if (err) {
      console.error("Error inserting review:", err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    return res.status(201).json({
      message: "Review added successfully"
    });
  });
});
app.put("/review/car/:carid", function (req, res) {
  var q = "UPDATE review SET `customername`=?, `title`=?, `content`=?, `rating`=?, `reviewdate`=? WHERE reviewid=?";
  var values = [req.body.customername, req.body.title, req.body.content, req.body.rating, req.body.reviewdate, req.params.id];
  db.query(q, values, function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    return res.status(201).json({
      message: "Review updated successfully"
    });
  });
});
app.put("/car/:id", function (req, res) {
  var carID = req.params.id;
  var _req$body5 = req.body,
      prod_name = _req$body5.prod_name,
      prod_description = _req$body5.prod_description,
      price = _req$body5.price,
      type = _req$body5.type;
  var image = req.files.image;
  var imagePath;

  if (image) {
    // If a new image is provided, upload it and update the imagePath
    imagePath = "public/upload/".concat(image.name);
    image.mv(imagePath, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error saving image"
        });
      }
    });
  }

  var q = "UPDATE car SET \n    prod_name = ?, \n    prod_description = ?, \n    ".concat(image ? "image = ?," : "", " \n    price = ?, \n    type = ? \n    WHERE id = ?");
  var values = [prod_name, prod_description, image ? imagePath : null, price, type, carID];
  db.query(q, values, function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    return res.status(201).json({
      message: "Car Updated"
    });
  });
});
app.get("/car/:id", function (req, res) {
  var q = "SELECT * FROM car WHERE id = ?";
  var carID = req.params.id;
  db.query(q, [carID], function (err, data) {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    if (data.length > 0) {
      return res.status(200).json(data[0]);
    } else {
      return res.status(404).json({
        message: "Car not found"
      });
    }
  });
});
app.get("/review/car/:carid", function (req, res) {
  var carID = req.params.carid;
  var q = "SELECT * FROM review WHERE carid = ?";
  db.query(q, [carID], function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    }

    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({
        message: "No reviews found for this car"
      });
    }
  });
});
app.listen(8800, function () {
  console.log("connected to backend");
});
//# sourceMappingURL=index.dev.js.map
