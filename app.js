//core module
//external module which is express

const express = require("express");

//LOCAL MODULE
const userRouter = require("./routes/userRouter");
const { hostRouter } = require("./routes/hostRouter");
const errorController = require("./controllers/errorController");
const {mongoconnect}  = require("./utils/databseUtil");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views"); //explicitly set the folder where it is stored
//views ke folder pe applicable hai

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(userRouter);
app.use("/host", hostRouter);

app.use(errorController.error);
//why status code is needed ?
const port = 3000;
mongoconnect(() => {
  app.listen(port, () => {
    console.log(`Server running on adress : http://localhost:${port}`);
  });
})


//now my new task is applying filter for price
