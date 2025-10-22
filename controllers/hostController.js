/*
I can store (host,home) in a seperate table in sql and then extract data from there...
so 
sql -> (host-home-list and favourites list and all users list)
mongodb -> (session , home details)
*/

const Home = require("../models/home");
const { getDB } = require("../utils/databseUtil");
exports.getaddHome = (req, res, next) => {
  console.log(`home req sent`);
  res.render("host/edit-home", {
    editing: false,
    isloggedin: req.isloggedin,
    user: req.session.user,
  });
};

exports.postAddHome = (req, res, next) => {
  const { HouseName, HouseNumber, Price, location, rating, description } =
    req.body;
  const db = getDB();

  // Check if HouseNumber already exists in MongoDB
  const host_id = req.session.user.id;
  console.log(host_id);
  db.collection("homes")
    .findOne({ HouseNumber: HouseNumber })
    .then((existing) => {
      if (existing) {
        return res.send("HouseNumber already exists!");
      }

      const home = new Home(
        HouseName,
        HouseNumber,
        Price,
        location,
        rating,
        description,
        null,
        host_id
      );
      home.save(host_id).then(() => {
        console.log(`home saved successfully`);
      });
    })
    .then(() => {
      res.render("host/Homeadded", {
        isloggedin: req.isloggedin,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.error("Error in postAddHome:", err);
      res.status(500).send("Server error");
    });
};

exports.postviewHome = (req, res, next) => {
  // for booking of home
  Home.fetchAll()
    .then((regHome) => {
      const homeID = req.body.homeID;
      const home = regHome.find((h) => h.HouseNumber == homeID);

      if (home) {
        console.log(`Booking Home: ${home.HouseName}`);
        // mark or save booking if needed
      } else {
        console.log(`Home not found`);
      }
      res.render("store/viewHome", {
        regHome: regHome,
        isloggedin: req.isloggedin,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.error("Error in postviewHome:", err);
      res.status(500).send("Server error");
    });
};

exports.getHostHomes = (req, res, next) => {
  //only the homes of the host must be called here otherwise to login page called
  if (req.session.isloggedin && req.session.user.role === "host") {
    //now the functionalities here
    Home.fetchAllHostHomes(req.session.user.id)
      .then((regHome) =>
        res.render("host/host-home-list", {
          regHome: regHome,
          isloggedin: req.session.isloggedin,
          user: req.session.user,
        })
      )
      .catch((err) => res.status(500).send("Server error"));
  }
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing =
    req.query.editing === "true" ||
    req.query.editing === "1" ||
    req.query.editing === true;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log(`home not found `);
        return res.redirect("/host/hosthomes");
      }
      console.log("Found home for edit:", home);
      res.render("host/edit-home", {
        editing: true,
        home: home,
        isloggedin: req.isloggedin,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.error("Error fetching home by id:", err);
      return res.redirect("/host/hosthomes");
    });
};

// handle edit form submission
exports.postEditHome = (req, res, next) => {
  const { _id, HouseName, HouseNumber, Price, rating, location, description } =
    req.body;
  const host_id = req.session.user.id;
  console.log(`id: ${_id}`);
  const updatedData = new Home(
    HouseName,
    HouseNumber,
    Price,
    location,
    rating,
    description,
    _id,
    host_id
  );

  console.log("this is the updated data", updatedData);
  updatedData
    .save(host_id)
    .then((result) => {
      console.log(`home edited successfully`);
      res.redirect("/host/hosthomes");
    })
    .catch((err) => console.log(err));
  res.redirect("/host/hosthomes");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  //now this is the tricky part
  //kisi guest user ke favourties yaa fir booking hongi unko bhi hatana padega
  //now how to delete bc from both sql and mongodb
  console.log(`came to delete `, homeId);
  Home.deleteById(homeId)
    .then(() => {
      res.redirect("/host/hosthomelist");
    })
    .catch(() => {
      res.redirect("/host/hosthomelist");
    });
};
