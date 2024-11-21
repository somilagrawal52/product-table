const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const { checkforauthentication } = require("./middlewares/auth");
const Product = require("./models/product");
const app = express();
const port = process.env.port || 5010;
require("dotenv").config();

mongoose
  .connect(process.env.database_url)
  .then(() => console.log("server connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkforauthentication("token"));

app.get("/", async (req, res) => {
  const allproduct = await Product.find({});
  console.log(allproduct);
  res.render("home", {
    user: req.user,
    products: allproduct,
  });
});

app.post("/update", async (req, res) => {
  try {
    const { ids, names, prices, descriptions } = req.body;
    for (let i = 0; i < ids.length; i++) {
      await Product.findByIdAndUpdate(ids[i], {
        name: names[i],
        price: prices[i],
        description: descriptions[i],
      });
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/clear/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(port, () => console.log(`server started at port:${port}`));
