const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.gethome = (req, res, next) => {
  res.render("store/home-page");
  //got it from the hostRouter
};
exports.viewHome = (req, res, next) => {
  Home.fetchAll()
    .then(regHome => {
      console.log('viewHome: fetched', Array.isArray(regHome) ? regHome.length : typeof regHome);
      if (Array.isArray(regHome) && regHome.length > 0) console.log('first home:', regHome[0]);
      res.render("store/viewHome", {regHome});
    })
    .catch(err => {
      console.error('Error fetching homes for viewHome:', err);
      res.status(500).send('Server error');
    });
};
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(home => {
      console.log(home);
      if (!home) {
        console.log(`no home found`);
        return res.redirect("/viewhome");
      }
      res.render("store/homedetail", { home });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Database error");
    });
};

exports.getfavourites = (req, res, next) => {
  Favourite.getFavourite()
    .then((favList) => {
      // favList is expected to be an array of home documents
      res.render("store/favlist", { regHome: favList });
    })
    .catch(err => {
      console.error("Error fetching favourites:", err);
      res.status(500).send("Something went wrong!");
    });
};

exports.postAddToFavourites = (req, res, next) => {
  console.log(req.body);
  if (!req.body || !req.body._id) {
    console.log("Body is missing or id is undefined");
    return res.status(400).send("No home ID received");
  }
  Favourite.addToFavourite(req.body._id)
  .then(()=>{
    console.log(`Something is done`);
  })
  .catch((err)=>{
    console.log(`there was some error`,err);
  })
  .finally(()=>{
    res.redirect("/viewhome");
  })
};

exports.removeFavourites = (req, res, next) => {
  // accept homeId either from body (form) or URL param
  const homeId = req.body.homeId || req.params.homeId;
  console.log("Home id is:", homeId);

  if (!homeId) {
    console.log("No homeId provided");
    return res.redirect("/favourites");
  }

  Favourite.removeFavourites(homeId)
    .then(() => res.redirect('/fa5vourites'))
    .catch(err => {
      console.error('Error removing favourite:', err);
      res.redirect('/favourites');
    });
};
