const express = require("express");
const mongoose = require("mongoose");
const methodOverrise = require("method-override");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
require("dotenv").config();

const app = express();
mongoose.connect(process.env.DB_URI);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverrise("_method"));
// main route
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createAt: "desc" });
  res.render("articles/index", { articles: articles });
});
app.use("/articles", articleRouter);
// localhost port
// app.listen(3000)

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://loccalhost:${process.env.PORT}`);
});
