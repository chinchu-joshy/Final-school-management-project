var express = require('express');
var router = express.Router();
var express = require('express');
var teacherHelper=require('../helpers/teacher-helper')
var router = express.Router();
var paypal=require('paypal-rest-sdk');
const collections=require('../config/collection')
var client=require('twilio')(collections.ACCOUNTSID,collections.AUTH_TOCKEN)
//const { getVideoDurationInSeconds } = require('get-video-duration')
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXicyBaFlcL2JKV46FBi3IfvzNOERaEWGPEUwpPZNBuhnY5YX7D4mC1hUFydUSqdp5tsRD2pYq8u8j_p',
  'client_secret': 'EAyGaPoBaFCt4s8ppzF5WGrpvFIntic7oRwIQis3A5Pkr6RZB_sD6YBGGl154qZcAjbD8NEcWclvdaxt'
});

// From a local path...

 
// From a URL...

 
// From a readable stream...
 
const fs = require('fs')

let redirectlogin=(req,res,next)=>{
  if(!req.session.loggIn){
    res.redirect('/')
  }else{
    next()
  }
}
let redirecthome=(req,res,next)=>{
  if(req.session.loggedIn){
    res.redirect('/',{student:true})
  }else{
    next()
  }
}
router.get('/student-entry',(req,res)=>{
 // console.log(req.session.student)
   if(req.session.student){
    //res.render('student/student-otp')
    res.redirect('/')
   }else{
    res.render('student/student-otp')
   // res.redirect('/')
   }
     
      
  })
  router.get('/student-home',async(req,res)=>{
    let Writtenwork = await teacherHelper.getWorks()
    let Pdf = await teacherHelper.getPdf()
//console.log(Pdf)
        let notepdf = await teacherHelper.getNotePdf()
//console.log(notepdf)
           let link = await teacherHelper.getNotelink()
           let announcement=await teacherHelper.getAnnouncement()
           let payevents =await teacherHelper.getPayevent()
           let events=await teacherHelper.getNormalevent()
    res.render('student/student-home',{student:true,Writtenwork,Pdf,notepdf,link
      ,user:req.session.user,announcement,payevents,events})
  })
router.post('/student-entry',(req,res)=>{
  if(req.session.loggin){
    //console.log(req.session.loggin)
    res.redirect('/student-home')
  }else{
    
    teacherHelper.OtpSend(req.body).then((response)=>{
      if(response.status){
        
        req.session.student=response.student
        //console.log(req.session.student)
       
        //console.log(req.session.student.loggIn)
        client
        .verify
        .services(collections.SERVICEID)
        .verifications
        .create({to:response.student.mobile, channel: 'sms'})
        .then((verification ) => {
        console.log(verification.status)
      res.render('student/otp')
         
    })
      }else{
        req.session.loginerr=true;
            let val = response.val
            
          res.render('student/student-otp',{val})
      }
      })
  }
    
    })
   
    //router.get('/next-stage', redirecthome,(req,res)=>{
      //if(req.session.loggedIn){
        //res.redirect('/home')
      //}else{
       // res.render('student/otp')
       
    // }
    //})


    
    
    router.post('/verify',(req,res)=>{
      if( req.session.student){
        teacherHelper.VerifyStudent(req.body).then(async(data)=>{
          let Writtenwork = await teacherHelper.getWorks()
     let Pdf = await teacherHelper.getPdf()
//console.log(Pdf)
         let notepdf = await teacherHelper.getNotePdf()
//console.log(notepdf)
            let link = await teacherHelper.getNotelink()
            let announcement=await teacherHelper.getAnnouncement()
            let payevents =await teacherHelper.getPayevent()
            let events=await teacherHelper.getNormalevent()
            
         // console.log(req.session.student)
          
           client
           .verify
           .services(collections.SERVICEID)
           .verificationChecks
               .create({to:data.mobile, code: data.code})
               .then((verification_check)=>{
                 console.log(verification_check.status)
                 if(verification_check.status=='approved'){
                   req.session.loggin=true;
                  res.render('student/student-home',{student:true,Writtenwork,Pdf,notepdf,link
                    ,user:req.session.user,announcement,payevents,events,})
                 }else{
                   let val=true;
                   res.render('student/otp',{val})
                   
                 }
                }
               
       
               );
             
         })
        
      }
      else{
        res.redirect('/')
        
      }
    })

    router.get('/student-login',(req,res)=>{
      res.render('student/student-login')
    })
    router.get('/student-register',(req,res)=>{
      res.render('student/student-signup')
    })
    router.post('/student-register',(req,res)=>{
      teacherHelper.dosignup(req.body).then((data)=>{
        req.session.loggedIn=true
        res.render('student/student-login')
      })
      
    })
    router.post('/student-login',(req,res)=>{
      teacherHelper.dologin(req.body).then(async(response)=>{
        let Writtenwork = await teacherHelper.getWorks()
   let Pdf = await teacherHelper.getPdf()
//console.log(Pdf)
       let notepdf = await teacherHelper.getNotePdf()
//console.log(notepdf)
          let link = await teacherHelper.getNotelink()
          let announcement=await teacherHelper.getAnnouncement()
          let payevents =await teacherHelper.getPayevent()
      let events=await teacherHelper.getNormalevent()

          let date_ob = new Date();
          let day = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let  date=year + "-" + month + "-" + day
       // console.log(req.session.student)
        if(response.status){
          req.session.loggedIn=true
          req.session.user=response.user
          let name=req.session.user.username
          let look= await teacherHelper.getStatusStart(name,date)
         console.log(look)
        
          res.render('student/student-home',{student:true,user:req.session.user,Writtenwork,notepdf,Pdf,link
            ,announcement,events,payevents,look})
        
          //console.log(req.session.user)
         
       }else{
           req.session.loginerr=true
           res.redirect('/student-login')
       }
      })

    })
  
  


  
    router.get('/student-out',(req,res)=>{
      req.session.student=null;
      req.session.user=null;
      //console.log(req.session.student)
      res.redirect('/')
    })
    router.get('/class-works',async(req,res)=>{
      let date_ob = new Date();
          let day = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let  date=year + "-" + month + "-" + day
      let students= req.session.student._id
      let teacher=await teacherHelper.getTeacher()
      let Writtenwork = await teacherHelper.getWorks()
      let Pdf = await teacherHelper.getPdf()
      let name=req.session.user.username
      let look= await teacherHelper.getStatusStart(name,date)
      //console.log(students)
      res.render('student/student-work',{student:true,students,teacher,Writtenwork,Pdf,user:req.session.user
      ,look})
    })
    router.post('/class-work',async(req,res)=>{
      let students= req.session.student._id
      let date_ob = new Date();
          let day = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let  date=year + "-" + month + "-" + day
      let Writtenwork = await teacherHelper.getWorks()
      let Pdf = await teacherHelper.getPdf()
      let name=req.session.user.username
          let look= await teacherHelper.getStatusStart(name,date)
      teacherHelper.assignment(req.body).then((response)=>{
        //console.log(req.body)
        let val =req.body.workId
        let pdf=req.files.head
        pdf.mv('public/assignments/'+val+'.pdf',(err,done)=>{
          if(!err){
       
      res.render('student/student-work',{student:true,students,Writtenwork,Pdf,user:req.session.user,look})
          }else{
            res.send('ERROR')
          }
        })
      })
      })
      router.get('/study-materials',async(req,res)=>{
        let date_ob = new Date();
          let day = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let  date=year + "-" + month + "-" + day
        
        let notepdf = await teacherHelper.getNotePdf()
        // console.log(notepdf)
            let link = await teacherHelper.getNotelink()
            let name=req.session.user.username
            let look= await teacherHelper.getStatusStart(name,date)
        //console.log(students)
        res.render('student/study-materials',{student:true,notepdf,link,user:req.session.user,look})
      })
      router.get('/today-task',async(req,res)=>{
        let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let  date=year + "-" + month + "-" + day
            console.log(date)
        let Writtenwork = await teacherHelper.getWorksdate(date)
        let Pdf = await teacherHelper.getPdfdate(date)
   //console.log(Pdf)
   let name=req.session.user.username
   let look= await teacherHelper.getStatusStart(name,date)
            let user=req.session.user
            // console.log(req.session.student)
            res.render('student/today-task',{student:true,user,Writtenwork,Pdf,look})
      })
      router.get('/class-video',async(req,res)=>{
        let date_ob = new Date();
        let day = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let  date=year + "-" + month + "-" + day
        let name=req.session.user.username
        let notepdf = await teacherHelper.getVideo(date)
        let look= await teacherHelper.getStatusStart(name,date)
        res.render('student/Class-video',{student:true,notepdf,user:req.session.user,name,look})
      })
      router.post('/watch-video',(req,res)=>{
        teacherHelper.addStatus(req.body).then((response)=>{
          res.json(response)
        })
      })
     router.get('/testing',async(req,res)=>{
      let name=req.session.user.username
      var events=await teacherHelper.getAttByStudent(name)

     
      //let events={
        //eventss:event
      //}
      console.log(events)
      let video =await teacherHelper.getVideos() 
       
        res.render('student/sample',{events,video})
      
      
     
       
     })
     router.get('/student-attendance',async(req,res)=>{
      let date_ob = new Date();
      let day = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let  date=year + "-" + month + "-" + day
      let name=req.session.user.username
      let details=await teacherHelper.getAttByStudent(name)
      let look= await teacherHelper.getStatusStart(name,date)
      
    
        res.render('student/student-attendance',{student:true,details,user:req.session.user,look})
     

      
     })
    
     router.get('/student-announcement',async(req,res)=>{
      let date_ob = new Date();
      let day = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let  date=year + "-" + month + "-" + day
      let name=req.session.user.username
      let announcement=await teacherHelper.getAnnouncement()
      let look= await teacherHelper.getStatusStart(name,date)
       res.render('student/student-announcement',{student:true,announcement,user:req.session.user,look})
     })
     router.get('/student-events',async(req,res)=>{
      let date_ob = new Date();
      let day = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let  date=year + "-" + month + "-" + day
      let payevents =await teacherHelper.getPayevent()
      let events=await teacherHelper.getNormalevent()
      let name=req.session.user.username
      let email=req.session.user.email
      let look= await teacherHelper.getStatusStart(name,date)
      res.render('student/student-events',{student:true,events,payevents,user:req.session.user,name,email,look})
     })
     router.post('/payment',(req,res)=>{
      teacherHelper.addpayment(req.body).then((response)=>{

     
        const create_payment_json = {
          "intent": "sale",
         
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:3000/success",
              "cancel_url": "http://localhost:3000/cancel"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                   
                      "name":response.events,
                      "sku": "001",
                      "price": response.prices,
                      "currency": "USD",
                      "quantity": 1,
                     
                  }]
              },
              "amount": {
                  "currency": "USD",
                  "total":response.prices
              },
              "description": response.events
          }]
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
          
         
          teacherHelper.addtoken(req.session.user.username,req.session.email,payment.id,response.prices).then(()=>{
            for(let i=0;i<payment.links.length;i++){
              if(payment.links[i].rel==='approval_url'){
              res.redirect(payment.links[i].href);
              }
            }
          })
           
        }
    });
     
     })
    })
     
     router.get('/success',async(req,res)=>{
      const payerId=req.query.PayerID;
      const paymentId=req.query.paymentId;
     let value=await teacherHelper.findtoken(paymentId)
        
      
          const execute_payment_json={
            "payer_id":payerId,
            "transactions":[{
              "amount":{
                "currency":"USD",
                "total":value.money
              }
            }]
          };
          paypal.payment.execute(paymentId,execute_payment_json,function(error,payment){
            if(error){
              console.log(error.response);
              throw error;
            }else{
            
             console.log(JSON.stringify(payment))
             res.render('student/student-login',{payerId})
    
            }
          })



       
     
      
      
    })
  
   router.get('/cancel',(req,res)=>{
     res.send('cancelled')
   })
   router.get('/back',async(req,res)=>{
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let  date=year + "-" + month + "-" + day
    let name=req.session.user.username
    
    let look= await teacherHelper.getStatusStart(name,date)
     res.render('student/student-home',{student:true,look})
   })
   router.get('/student-photos',async(req,res)=>{
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let  date=year + "-" + month + "-" + day
    let name=req.session.user.username
    
    let look= await teacherHelper.getStatusStart(name,date)
    let pic=await teacherHelper.getpic()
    res.render('student/student-gallery',{student:true,pic,look,user:req.session.user})
   })
module.exports = router;
