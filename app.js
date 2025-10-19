//core module
//external module which is express
const DB_PATH = "mongodb+srv://root:root@rohitsingh.oa2ul7f.mongodb.net/airbnb?retryWrites=true&w=majority&appName=RohitSingh";
//.net ke baad database ka naam aana chahiye

const express = require("express");

//LOCAL MODULE
const userRouter = require("./routes/userRouter");
const { hostRouter } = require("./routes/hostRouter");
const errorController = require("./controllers/errorController");
const { mongoconnect } = require("./utils/databseUtil");
const authRouter = require("./routes/authRouter");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
app.set("view engine", "ejs");
app.set("views", "views"); //explicitly set the folder where it is stored
//views ke folder pe applicable hai

// Serve static files from the 'public' directory
app.use(express.static("public"));
const store = new MongoDBStore({
  uri: DB_PATH, //uniform resource locator
  collection: "sessions", // name of the collection in MongoDB
});

app.use(
  session({
    //secret session key is used to sign the session id cookie
    secret: "Rohit Singh session",
    //forces session data to be saved back to the session store
    resave: false,
    //forces a sessio uninitilised to be saved to the store
    saveUninitialized: true,
    store: store, //iske andar store karna start kr dega
  })
);
app.use((req, res, next) => {
  req.isloggedin = req.session.isloggedin;

  // expose to EJS templates so partials like navbar can read it
  // res.locals.isloggedin = req.isloggedin;
  // if(req.isloggedin == false ){
  //   return res.redirect("/login");
  // }
  res.locals.isloggedin = req.isloggedin;
  next();
});
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.use(express.json());
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