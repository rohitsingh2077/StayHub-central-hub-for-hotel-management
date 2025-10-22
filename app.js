//core module
//external module which is express
const DB_PATH = "mongodb+srv://root:root@rohitsingh.oa2ul7f.mongodb.net/airbnb?retryWrites=true&w=majority&appName=RohitSingh";
//.net ke baad database ka naam aana chahiye

const express = require("express");

const multer = require('multer');
const { mongoconnect } = require("./utils/databseUtil");
const session = require("express-session");

//LOCAL MODULE
const userRouter = require("./routes/userRouter");
const { hostRouter } = require("./routes/hostRouter");
const errorController = require("./controllers/errorController");
const authRouter = require("./routes/authRouter");

const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
app.set("view engine", "ejs");
app.set("views", "views"); //explicitly set the folder where it is stored


const store = new MongoDBStore({
  uri: DB_PATH, //uniform resource locator
  collection: "sessions", // name of the collection in MongoDB
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());

app.use(
  session({
    secret: "Rohit Singh session",
    resave: false,
    saveUninitialized: true,
    store: store
  })
);

app.use((req, res, next) => {
  req.isloggedin = req.session.isloggedin;
  res.locals.isloggedin = req.isloggedin;
  next();
});

app.use(authRouter);

/*file handling middleware*/



app.use(userRouter);
// protect /host routes: only allow when req.isloggedin is truthy
app.use("/host", (req, res, next) => {
  if (req.isloggedin) return next();
  return res.redirect("/login");
});
app.use("/host", hostRouter);

app.use(errorController.error);
//why status code is needed ?
const port = 3000;
mongoconnect(() => {
  app.listen(port, () => {
    console.log(`Server running on adress : http://localhost:${port}`);
  });
});
//now my new task is applying filter for pricete