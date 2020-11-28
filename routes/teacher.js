var express = require('express');
var teacherHelper=require('../helpers/teacher-helper')
var router = express.Router();
let verify=(req,res,next)=>{
  if(req.session.teacher){
      next()
  }else{
      res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/landing-page',{land:true});
});
router.get('/login',(req,res)=>{
  
    res.render('teacher/login')
  
  
})
router.post('/login',(req,res)=>{
  teacherHelper.checkAccount(req.body).then((response)=>{
    //console.log(req.body)
    if(response.status){
           
      
      req.session.teacher=response.teacher
      req.session.teacher.loggedIn=true
      let teacher=req.session.teacher
      res.render('teacher/home',{teacher:true,teacher})
   }else{
       req.session.loginerr=true
       res.redirect('/login')
   }
  })
})
router.get('/logout',(req,res)=>{
  req.session.teacher=null
  res.redirect('/')
})

module.exports = router;
