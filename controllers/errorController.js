exports.error = (req,res,next)=>{
    res.status(404).render('404',{
        isloggedin : req.isloggedin,
        user :req.session.user
    });
};
