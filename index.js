require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { connectMongoDb } = require("./connection");

const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const blogRouter = require("./routes/blogRouter");

connectMongoDb(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));
app.set("views", path.resolve("./views"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/user/login");
});
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/home", homeRouter);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use((req, res) => {
  res.status(404).render("404", { user: req.user || null });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT} in ${process.env.NODE_ENV} mode`);
});
