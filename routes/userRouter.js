//external module
const express=  require('express')
const userRouter = express.Router()

//when i want to load the home page
const storedController = require('../controllers/storedController');

userRouter.get("/",storedController.gethome);
userRouter.get('/viewhome' ,storedController.viewHome);
userRouter.get("/viewhome/:homeId",storedController.getHomeDetails);
userRouter.get("/favourites",storedController.getfavourites);
userRouter.post("/favourites" , storedController.postAddToFavourites)
userRouter.post("/favourites/delete-home/:homeId",storedController.removeFavourites);
module.exports= userRouter;
