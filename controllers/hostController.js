/*
I can store (host,home) in a seperate table in sql and then extract data from there...
so 
sql -> (host-home-list and favourites list and all users list)
mongodb -> (session , home details)
*/

const Home = require("../models/home");
const { getDB } = require("../utils/databseUtil");
exports.getaddHome = (req, res, next) => {
  console.log(`get add home called`);
  res.render("host/edit-home", {
    editing: false,
    isloggedin: req.isloggedin,
    user: req.session.user,
  });
};

exports.postAddHome = (req, res, next) => {
  console.log("req body" , req.body);
  if(typeof req.body === 'undefined'){
    return res.redirect("/");
  }
  const { HouseName, HouseNumber, Price, location, rating, description } = req.body;
  const db = getDB();

  console.log('post add home called');
  console.log('File uploaded:', req.file);

  // Host ID from session
  const host_id = req.session.user.id;
  console.log('Host ID:', host_id);

  if (!req.file) {
    return res.status(400).send("No photo uploaded!");
  }

  // Save file path (depending on multer config)
  const photoPath = req.file.path; // or req.file.filename if you store only names

  // Check if HouseNumber already exists
  db.collection("homes")
    .findOne({ HouseNumber })
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
        host_id,
        photoPath
      );

      console.log('Home to save:', home);

      return home.save(host_id).then(() => {
        console.log(`Home saved successfully`);
        res.render("host/Homeadded", {
          isloggedin: req.isloggedin,
          user: req.session.user,
        });
      });
    })
    .catch((err) => {
      console.error("Error in postAddHome:", err);
      res.status(500).send("Server error");
    });
};

exports.getHostHomes = (req, res, next) => {
  //only the homes of the host must be called here otherwise to login page called
  console.log('get host homes called');
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
  const {HouseName, HouseNumber, Price, rating, location, description,_id } =
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
      res.redirect("/host/hosthomes");
    })
    .catch(() => {
      res.redirect("/host/hosthomes");
    });
};
