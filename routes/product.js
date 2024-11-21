const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("addproduct", { products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/add-new", (req, res) => {
  return res.render("addproduct", {
    user: req.user,
  });
});

router.post("/", upload.single("Image"), async (req, res) => {
  const { name, price, description } = req.body;
  const product = await Product.create({
    name,
    price,
    description,
    Image: `/uploads/${req.file.filename}`,
  });
  return res.redirect("/");
});

module.exports = router;
