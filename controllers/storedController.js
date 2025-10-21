const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.gethome = (req, res, next) => {
  // console.log(`info about session: `, req.session);
  res.render("store/home-page", {
    isloggedin: req.isloggedin,
    user: req.session.user,
  });
  //got it from the hostRouter
};
exports.viewHome = (req, res, next) => {
  if (!req.session.isloggedin) {
    return res.redirect("/login");
  }
  console.log(req.session);
  Home.fetchAll()
    .then((regHome) => {
      console.log(
        "viewHome: fetched",
        Array.isArray(regHome) ? regHome.length : typeof regHome
      );
      if (Array.isArray(regHome) && regHome.length > 0)
        console.log("first home:", regHome[0]);
      console.log(req.isloggedin);
      res.render("store/viewHome", {
        regHome: regHome,
        isloggedin: req.isloggedin,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.error("Error fetching homes for viewHome:", err);
      res.status(500).send("Server error");
    });
};
exports.getHomeDetails = (req, res, next) => {
  if (!req.session.isloggedin) {
    return res.redirect("/login");
  }
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      console.log(home);
      if (!home) {
        console.log(`no home found`);
        return res.redirect("/viewhome");
      }
      res.render("store/homedetail", {
        home: home,
        isloggedin: req.isloggedin,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Database error");
    });
};

exports.getfavourites = (req, res, next) => {
  if (!req.session.isloggedin) {
    return res.redirect("/login");
  }
  console.log(req.session.user);
  Favourite.getFavourite(req.session.user.id)
    .then((favList) => {
      // favList is expected to be an array of home documents
      console.log(favList);
      res.render("store/favlist", {
        regHome: favList,
        isloggedin: req.isloggedin,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.error("Error fetching favourites:", err);
      res.status(500).send("Something went wrong!");
    });
};

exports.postAddToFavourites = (req, res, next) => {
  if (!req.session.isloggedin) {
    return res.redirect("/login");
  }
  console.log(req.body);
  if (!req.body || !req.body._id) {
    console.log("Body is missing or id is undefined");
    return res.status(400).send("No home ID received");
  }
  Favourite.addToFavourite(req.session.user.id, req.body._id)
    .then(() => {
      console.log("Added to favourites");
      res.redirect("/viewhome");
    })
    .catch((err) => {
      console.log("Error adding to favourites", err);
      res.status(500).send("Something went wrong");
    });
};

exports.removeFavourites = (req, res, next) => {
  if (!req.session.isloggedin) {
    return res.redirect("/login");
  }
  // accept homeId either from body (form) or URL param
  const homeId = req.body.homeId || req.params.homeId;

  console.log("Home id is:", homeId);

  if (!homeId) {
    console.log("No homeId provided");
    return res.redirect("/favourites");
  }

  Favourite.removeFavourites(req.session.user.id, homeId)
    .then(() => res.redirect("/favourites"))
    .catch((err) => {
      console.error("Error removing favourite:", err);
      res.redirect("/favourites");
    });
};
