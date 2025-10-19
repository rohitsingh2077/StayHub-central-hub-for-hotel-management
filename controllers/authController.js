exports.getlogin = (req,res,next)=>{
  console.log(`get login called`);
  // prefer the middleware-parsed value (available on req or res.locals)
  res.render("auth/login" );
}
exports.postlogin = (req,res,next)=>{
  console.log(req.body);
  //logging in to be true 
  // set cookie explicitly as string 'true' so server parsing is predictable
  // res.cookie('isloggedin', 'true');
  req.session.isloggedin = true;
  res.redirect("/");
}

exports.postlogout = (req,res,next)=>{
  //handling the logging out session => isloggedin ko false krdena hai
  // clear cookie by setting expired maxAge
  // res.cookie('isloggedin', 'false');
  req.session.isloggedin = false;
  res.redirect('/');
}