var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

// Kết nối MongoDB
const mongodb = 'mongodb+srv://asm:AsTQAXFTrF6UVW14@cluster0.ifklm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(err => {
      console.error("MongoDB connection error:", err);
    });

// Schema cho xe ô tô
const carSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  year: Number,
  price: Number,
  description: String
});

const Car = mongoose.model('Car', carSchema);

/* GET home page: Hiển thị danh sách xe */
router.get('/', async function (req, res, next) {
  try {
    const cars = await Car.find(); // Lấy danh sách xe từ MongoDB
    res.render('index', { title: 'Car Management', cars });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).send("Error fetching cars");
  }
});
/* GET /edit/:id: Hiển thị form chỉnh sửa */
router.get('/edit/:id', async function (req, res, next) {
  try {
    const car = await Car.findById(req.params.id); // Tìm xe theo ID
    if (!car) {
      return res.status(404).send("Car not found");
    }
    res.render('edit', { title: 'Edit Car', car }); // Gửi dữ liệu xe tới form edit
  } catch (err) {
    console.error("Error fetching car for edit:", err);
    res.status(500).send("Error fetching car for edit");
  }
});


/* POST /add: Thêm xe mới */
router.post('/add', async function (req, res, next) {
  const { name, manufacturer, year, price, description } = req.body;
  try {
    const newCar = new Car({ name, manufacturer, year, price, description });
    await newCar.save();
    res.redirect('/'); // Quay lại trang chính
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).send("Error adding car");
  }
});

/* POST /delete/:id: Xóa xe */
router.post('/delete/:id', async function (req, res, next) {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect('/'); // Quay lại trang chính
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).send("Error deleting car");
  }
});
/* POST /edit/:id: Cập nhật thông tin xe */
router.post('/edit/:id', async function (req, res, next) {
  const { name, manufacturer, year, price, description } = req.body; // Nhận dữ liệu từ form
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, {
      name,
      manufacturer,
      year,
      price,
      description
    }, { new: true }); // Cập nhật và trả về xe mới

    if (!updatedCar) {
      return res.status(404).send("Car not found");
    }

    res.redirect('/'); // Quay lại danh sách xe sau khi cập nhật
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).send("Error updating car");
  }
});


module.exports = router;
