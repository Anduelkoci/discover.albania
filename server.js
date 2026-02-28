const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* ===== FILE UPLOAD ===== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ===== GET CITIES ===== */

app.get("/api/cities", (req, res) => {
  const data = fs.readFileSync("cities.json");
  res.json(JSON.parse(data));
});

/* ===== ADD CITY ===== */

app.post("/api/cities", upload.single("image"), (req, res) => {
  const cities = JSON.parse(fs.readFileSync("cities.json"));

  const newCity = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    image: "/uploads/" + req.file.filename
  };

  cities.push(newCity);
  fs.writeFileSync("cities.json", JSON.stringify(cities, null, 2));

  res.json({ message: "City added!" });
});

/* ===== DELETE CITY ===== */

app.delete("/api/cities/:id", (req, res) => {
  let cities = JSON.parse(fs.readFileSync("cities.json"));

  cities = cities.filter(city => city.id != req.params.id);

  fs.writeFileSync("cities.json", JSON.stringify(cities, null, 2));

  res.json({ message: "City deleted!" });
});

app.listen(3000, () => {
  console.log("SUPER PRO SERVER RUNNING ON http://localhost:3000");
});