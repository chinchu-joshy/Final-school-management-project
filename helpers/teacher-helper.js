var db=require('../config/connection')
const collections=require('../config/collection')
const bcrypt=require('bcrypt')
const objectId=require('mongodb').ObjectID
module.exports={
    checkAccount:(teacherdata)=>{
        //console.log(teacherdata)
     return new Promise(async(resolve,reject)=>{
        let loginstatus=false
            let response={}
           let teacherValue=await db.get().collection('teacherId').findOne({Password:teacherdata.Password})
          
            if(teacherValue){
                //console.log("success")
                response.teacher=teacherValue
                response.status=true
                resolve(response)

            }else{
                console.log("fail")
                resolve({status:false})

            }
            

        })
    }
    
     }