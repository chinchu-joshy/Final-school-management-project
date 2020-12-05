var express = require('express');
var teacherHelper=require('../helpers/teacher-helper')
var router = express.Router();
const collections=require('../config/collection')
var client=require('twilio')(collections.ACCOUNTSID,collections.AUTH_TOCKEN)
let verify=(req,res,next)=>{
  if(req.session.loggedIn){
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
  if(req.session.loggedIn){
    res.render('teacher/home',{teacher:true})

}else{
  
 res.render('teacher/login',{"login":req.session.loginerr})
 req.session.loginerr=false

 }
  
  
  
})
router.post('/login',(req,res)=>{
  teacherHelper.checkAccount(req.body).then((response)=>{
    //console.log(req.body)
    if(response.status){
           
      
      req.session.teacher=response.teacher
      req.session.loggedIn=true
      let teacher=req.session.teacher
      res.render('teacher/home',{teacher:true,teacher})
   }else{
   
    req.session.loginerr=true
       res.redirect('/login')
      
   }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/profile',async(req,res)=>{
 

 
  res.render('teacher/profile',{teacher:true})
})
router.get('/students',(req,res)=>{
  teacherHelper.getStudents().then((students)=>{
    res.render('teacher/students',{teacher:true,students})
  })
 
})
router.get('/add-students',(req,res)=>{
  res.render('teacher/add-students',{teacher:true})
})
router.get('/uploads',(req,res)=>{
  res.render('teacher/uploads')
})
router.post('/added-student',(req,res)=>{
teacherHelper.addStudent(req.body).then((id)=>{
  let image=req.files.Image
  image.mv('public/images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.render('teacher/add-students')
    }else{
      res.send('ERROR')
    }
  })

})
})
router.get('/edit-student/:id',async(req,res)=>{
  let students=await teacherHelper.getvalue(req.params.id)
res.render('teacher/edit-student',{students,teacher:true})
 

})
router.post('/edit-student/:id',(req,res)=>{
  
  teacherHelper.editStudent(req.body,req.params.id).then(async()=>{
    let id=req.params.id
    students=await teacherHelper.getStudents()
    res.render('teacher/students',{teacher:true,students})
    if(req.files.Image){
      let image=req.files.Image
      image.mv('public/images/'+id+'.jpg')
    }
  })
})
router.get('/delete-student/:id',(req,res)=>{
teacherHelper.deleteStudent(req.params.id).then(async()=>{
  students=await teacherHelper.getStudents()
  res.render('teacher/students',{teacher:true,students})
})
})
router.post('/edit-profile',(req,res)=>{
  
  
  let image=req.files.Image
  image.mv('public/teacher-image/'+'image'+'.jpg',(err,done)=>{
    if(!err){
      res.render('teacher/profile')
    }else{
      res.send('ERROR')
    }
  })

})
router.get('/home',(req,res)=>{
  res.render('teacher/home',{teacher:true})
})

router.get('/get/:id',async(req,res)=>{
  let number=await teacherHelper.findNumber(req.params.id)
  //console.log(number)
  client
  .verify
  .services(collections.SERVICEID)
  .verifications
  .create({to: number, channel: 'sms'})
  .then(verification => console.log(verification.status));
 
})
router.get('/student-otp',(req,res)=>{
  res.render('student/otp')
})
router.post('/verify',(req,res)=>{
  teacherHelper.VerifyStudent(req.body).then((data)=>{
    //console.log(data)
    client
    .verify
    .services(collections.SERVICEID)
    .verificationChecks
        .create({to:data.mobile, code: data.code})
        .then((verification_check)=>{
          console.log(verification_check.status)
          if(verification_check.status){
           res.render('student/home',{student:true,})
          }else{
            let val=verification_check.status
            res.render('student/otp',{val})
          }
         }
        

        );
        
  })
 
 
})
router.get('/student-login',(req,res)=>{
  if(req.session.loggedIn){
    res.render('student/student-home',{student:true})

}else{
  
 res.render('student/student-login',{"login":req.session.loginerr})
 req.session.loginerr=false

 }
  


})
router.get('/signup',(req,res)=>{
  res.render('student/signup')
})
router.post('/signup',(req,res)=>{
  teacherHelper.StudentSignUp(req.body).then((response)=>{
    req.session.loggedIn=true
        req.session.student=response
        res.render('student/student-home',{student:true})
  })
})
router.post('/student-login',(req,res)=>{
  teacherHelper.Dologin(req.body).then((response)=>{
    if(response.status){
           
      req.session.loggedIn=true
      req.session.student=response.student
      res.render('student/student-home',{student:true})
   }else{
       req.session.loginerr=true
       res.redirect('student/student-login')
   }
  })
})
router.get('/student-logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})


module.exports = router;
