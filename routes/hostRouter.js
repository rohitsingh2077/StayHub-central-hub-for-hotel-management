const express =require('express')
const hostRouter = express.Router();

const hostController= require('../controllers/hostController')

hostRouter.get("/add-home",hostController.getaddHome);
hostRouter.post("/add-home" ,hostController.postAddHome)
// hostRouter.get("/hosthomelist",hostController.viewHostHome)
hostRouter.get("/hosthomes" , hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId" , hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId",hostController.postDeleteHome);

exports.hostRouter = hostRouter; // object banake export kar raha hoo so have to destructure it on recieving

/*
EJS  lets u embed js code within HTML
<% %> for control flow and <% = % > for output
ejs is also know as templating engine
entire js can be used 
embedded java script
*/
