const express = require("express");
const app = express();
const Listing = require("./models/listing");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//const sampleListings = require("./data");
//const sampleListings = require("./init/data");
const { data: sampleListings } = require("./init/data");


// Routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

// DB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

// View Engine & Static Files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session Config
const sessionConfig = {
  secret: "luxoraSecretCode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & Current User Middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
