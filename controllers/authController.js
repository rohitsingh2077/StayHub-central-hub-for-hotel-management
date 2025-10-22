const { check, body, validationResult } = require("express-validator");
const { error } = require("./errorController");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getlogin = (req, res, next) => {
  console.log(`get login called`);
  res.render("auth/login", {
    oldInput: {},
    user: {},
  });
};

exports.postlogin = (req, res, next) => {
  
  const { email, password } = req.body;

  User.find(email)
    .then(([rows]) => {
      if (rows.length === 0) {
        console.log("User not found");
        return res.status(422).render("auth/login", {
          isloggedin: false,
          oldInput: { email },
          errors: ["Invalid email or password"],
          user: {},
        });
      }

      // bcrypt.compare returns a Promise
      return bcrypt.compare(password, rows[0].password).then((isMatch) => {
        if (!isMatch) {
          return res.status(422).render("auth/login", {
            isloggedin: false,
            oldInput: { email },
            errors: ["Invalid password"],
          });
        }

        // Login successful
        console.log(`match found now logging in`);
        req.session.isloggedin = true;
        req.session.user = rows[0];
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).render("auth/login", {
              isloggedin: false,
              oldInput: { email },
              errors: ["Something went wrong, please try again later."],
              user: {},
            });
          }
          res.redirect("/");
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render("auth/login", {
        isloggedin: false,
        oldInput: {},
        errors: ["Something went wrong, please try again later."],
        user: {},
      });
    });
};

exports.postlogout = (req, res, next) => {
  //handling the logging out session => isloggedin ko false krdena hai
  // clear cookie by setting expired maxAge
  // res.cookie('isloggedin', 'false');
  req.session.isloggedin = false;
  res.redirect("/");
};

exports.postsignup = [
  // Validation middlewares
  check("first_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("At least 2 characters needed in name")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Only letters and spaces allowed"),

  check("second_name")
    .optional({ checkFalsy: true }) // second name is optional
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Only letters and spaces allowed"),

  check("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),

  body("confirmed_password")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("role").isIn(["guest", "host"]).withMessage("Please select a role"),

  check("agreement")
    .equals("on")
    .withMessage("You must agree to terms and conditions"),

  // Final handler
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors);
    const { first_name, last_name, email, password, role } = req.body;
    //12 means 12 baar hashing hogi using algorithm
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User(first_name, last_name, email, hashedPassword, role);
      if (!errors.isEmpty()) {
        // Send back validation errors to the form
        return res.status(422).render("auth/signup", {
          isloggedin: false,
          errors: errors.array(),
          oldInput: req.body,
          errors: errors.array().map((err) => err.msg),
          user: {},
        });
      } else {
        user
          .save()
          .then(() => {
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
            // push custom error message just like validation ones
            return res.status(422).render("auth/signup", {
              //res status ko 422 set karna hoga

              isloggedin: false,
              oldInput: req.body,
              errors: ["Email ID already registered"],
              user: {}, // array for easy looping in EJS
            });
          });
      }
    });
  },
];
exports.getsignup = (req, res, next) => {
  oldInput = {}; //is bkl cheez ne dimag kharab kar diya
  res.render("auth/signup", {
    oldInput: oldInput,
    user: {},
  });
};
