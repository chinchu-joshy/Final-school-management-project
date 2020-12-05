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
    },
    addStudent:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_COLLECTION).insertOne(studentId).then((data)=>{
                console.log(data)
           resolve(data.ops[0]._id)
           

            })
        })
    },
    getStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            let students=await db.get().collection(collections.STUDENT_COLLECTION).find().toArray()
            resolve(students)
        })
    },
    getvalue:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_COLLECTION).findOne({_id:objectId(studentId)}).then((response)=>{
                
             resolve(response)
            })
        })
    },
    editStudent:(value,studentid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_COLLECTION).updateOne({_id:objectId(studentid)},{
                $set:{
                    name:value.name,
                    mobile:value.mobile,
                    email:value.email,
                    attendance:value.attendance,
                    cgpu:value.cgpu,
                    activebacklogs:value.activebacklogs,



                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    deleteStudent:(studentId)=>{
          return new Promise((resolve,reject)=>{
              db.get().collection(collections.STUDENT_COLLECTION)
              .removeOne({_id:objectId(studentId)}).then(()=>{
                  resolve()
              })
          })
    
},
findNumber:(teacherId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.STUDENT_COLLECTION).findOne({_id:objectId(teacherId)}).then((data)=>{
           //console.log(data.mobile)
           resolve(data.mobile)

        })
    })
},
VerifyStudent:(studentId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.STUDENT_DETAILS).insertOne(studentId).then((data)=>{
            //console.log(data.ops[0])
            resolve(data.ops[0])
        })
    })
},
StudentSignUp:(studentId)=>{
    console.log(studentId)
    return new Promise(async(resolve,reject)=>{
        studentId.password=await bcrypt.hash(studentId.password,10)
        db.get().collection(collections.STUDENT_LOGIN).insertOne(studentId).then((data)=>{
            resolve(data)
        })
    })
},
Dologin:(userdata)=>{
    return new Promise(async(resolve,reject)=>{
        let loginstatus=false
        let response={}
        let student=await db.get().collection(collections.STUDENT_LOGIN).findOne({email:userdata.email})
        if(student){
          
             bcrypt.compare(userdata.password,student.password).then((status)=>{
                 if(status){
                     //console.log("success")
                     response.student=student
                     response.status=true
                     resolve(response)

                 }else{
                     //console.log("fail")
                     resolve({status:false})

                 }

             })

        }else{
            //console.log("fail")
            resolve({status:false})
        }
    })
}

}