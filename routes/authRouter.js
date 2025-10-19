//external module
const express=  require('express')
const authRouter = express.Router()

//when i want to load the home page
const authController = require('../controllers/authController');

authRouter.get("/login" , authController.getlogin);
authRouter.post("/login",authController.postlogin);
authRouter.get("/logout" , authController.postlogout);
module.exports= authRouter;