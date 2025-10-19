const Home = require("../models/home");
const { getDB } = require("../utils/databseUtil");
exports.getaddHome = (req, res, next) => {
  console.log(`home req sent`);
  res.render("host/edit-home", {
    editing: false,
  });
};

exports.postAddHome = (req, res, next) => {
  const { HouseName, HouseNumber, Price, location, rating, description, HousePhoto } = req.body;
  const db = getDB();

  // Check if HouseNumber already exists in MongoDB
  db.collection('homes').findOne({ HouseNumber: HouseNumber })
    .then(existing => {
      if (existing) {
        return res.send('HouseNumber already exists!');
      }

      const home = new Home(HouseName, HouseNumber, Price, location, rating, description, null);
      home.save().then(()=>{
        console.log(`home saved successfully`);
      })
    })
    .then(() => {
      res.render('host/Homeadded');
    })
    .catch(err => {
      console.error('Error in postAddHome:', err);
      res.status(500).send('Server error');
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
      res.render("store/viewHome", { regHome });
    })
    .catch(err => {
      console.error('Error in postviewHome:', err);
      res.status(500).send('Server error');
    });
};

exports.viewHostHome = (req, res, next) => {
  //returns a promise
  Home.fetchAll()
    .then((regHome) => res.render("host/host-home-list", { regHome }))
    .catch(err => res.status(500).send('Server error'));
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll()
    .then((regHome) => res.render("host/host-home-list", { regHome }))
    .catch(err => res.status(500).send('Server error'));
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
      console.log('Found home for edit:', home);
      res.render("host/edit-home", {
        editing: true,
        home: home,
      });
    })
    .catch(err => {
      console.error('Error fetching home by id:', err);
      return res.redirect("/host/hosthomes");
    });
};

// handle edit form submission
exports.postEditHome = (req, res, next) => {
  const {_id, HouseName, HouseNumber, Price, rating, location, description } = req.body;
  console.log(`id: ${_id}`);
  const updatedData = new Home( HouseName, HouseNumber, Price, rating, location, description,_id );
  
  console.log("this is the updated data", updatedData);
  updatedData.save().then(result =>{
    console.log(`hello`);
  })
  res.redirect("/host/hosthomes");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log(`came to delete `, homeId);
  Home.deleteById(homeId).then(()=>{
    res.redirect("/host/hosthomelist");
  })
  .catch(()=>{
    res.redirect("/host/hosthomelist");
  });
};
