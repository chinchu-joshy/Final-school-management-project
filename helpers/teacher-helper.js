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

OtpSend:(studentId)=>{
    return new Promise(async(resolve,reject)=>{
        let response={};
        let studentval= await db.get().collection(collections.STUDENT_COLLECTION).findOne({rollnumber:studentId.rollnumber})
            //console.log(student)
            if(studentval){
                response.student=studentval
                response.status=true
                resolve(response)      
            }else{
                response.status=false
                response.val=true
              resolve(response)
            }
            
        })
    
},
addWorks:(work)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.STUDENT_ASSIGNED_WORK).insertOne(work).then((data)=>{
            resolve(data.ops[0]._id)
        })
    })
}
,
    getWorks:()=>{
        return new Promise(async(resolve,reject)=>{
            let works=await db.get().collection(collections.STUDENT_ASSIGNED_WORK).find().toArray()
            resolve(works)
        })
    },
addPdf:(work,type)=>{
    return new Promise((resolve,reject)=>{
        let obj={
            topic:work.head,
            file:type,
            date:work.pdfdate

        }
        console.log(obj)
        db.get().collection(collections.STUDENT_ASSIGNED_PDF).insertOne(obj).then((data)=>{
            resolve(data.ops[0]._id)
        })
    })
},
getPdf:()=>{
    return new Promise(async(resolve,reject)=>{
        let pdf=await db.get().collection(collections.STUDENT_ASSIGNED_PDF).find().toArray()
        resolve(pdf)
    })
},

addNotePdf:(note,type)=>{
    
    return new Promise(async(resolve,reject)=>{
        let date_ob = new Date();
        let day = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        
        let file=type;
       
        let work= await db.get().collection(collections.STUDENT_NOTE).findOne({topic:note.head})

          console.log(work)
          if(work){
              var val=work._id
              db.get().collection(collections.STUDENT_NOTE).updateOne({topic:note.head},{
                
                $push:{files:file}
                  
              }).then(()=>{
               resolve(val)
               //console.log(val)
              })

          }
            else{

                let obb={
                    topic:note.head,
                    date:year + "-" + month + "-" + day,
                    files:[file]
                    
        
                }
        db.get().collection(collections. STUDENT_NOTE).insertOne(obb).then((data)=>{
            resolve(data.ops[0]._id)
            //console.log(data.ops[0])
        })
    }
    
    })
},
getNotePdf:()=>{
    return new Promise(async(resolve,reject)=>{
        let pdf=await db.get().collection(collections. STUDENT_NOTE).find().toArray()
        //console.log(pdf)
        resolve(pdf)
    })
},
addNotelink:(note)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.STUDENT_NOTE_LINK).insertOne(note).then((data)=>{
            resolve(data.ops[0])
        })
    })
},
getNotelink:()=>{
    return new Promise(async(resolve,reject)=>{
        let link=await db.get().collection(collections.STUDENT_NOTE_LINK).find().toArray()
        resolve(link)
    })
},
getTeacher:()=>{
 return new Promise(async(resolve,reject)=>{
     let teacher=await db.get().collection('teacherId')
     resolve(teacher)
 })
},
//assignment:(submit)=>{
   // return new Promise((resolve,reject)=>{
       // db.get().collection(collections.SUBMITTED_WORKS).insertOne(submit).then((data)=>{
          //  resolve(data.ops[0]._id)

        //})
    //})
//},
assignment:(submit)=>{

    return new Promise(async(resolve,reject)=>{
        let date_ob = new Date();
        let day = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        //console.log(submit)
           let work={
               item:objectId(submit.workId),
               student:objectId(submit.studentId),
               workname:submit.works,
               workdate:year + "-" + month + "-" + day
            }
        //console.log(work)
      
               
            //console.log(assObj)
            db.get().collection(collections.SUBMITTED_WORKS).insertOne(work).then((data)=>{
                //console.log(data)
              resolve(data)  
            })
       

    }) 

    },
    getAssignment:(body)=>{
        return new Promise(async(resolve,reject)=>{
           let data= await db.get().collection(collections.SUBMITTED_WORKS).find({student:objectId(body)}).toArray()
           resolve(data)
            
        })

    },
    deleteAssignment:(assignment)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_ASSIGNED_WORK).removeOne({_id:objectId(assignment)}).then(()=>{
                resolve()
            })
        })
    },
    deletepdf: (assignment)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_ASSIGNED_PDF).removeOne({_id:objectId(assignment)}).then(()=>{
                resolve()
            })
        })
    },
    deleteNotepdf: (assignment)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_NOTE).removeOne({_id:objectId(assignment)}).then(()=>{
                resolve()
            })
        })
    },
    
    deletelink: (assignment)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENT_NOTE_LINK).removeOne({_id:objectId(assignment)}).then(()=>{
                resolve()
            })
        })
    },
    viewWorks:(work)=>{
        return new Promise(async(resolve,reject)=>{
           // console.log(objectId(work))
            let assignments=await db.get().collection(collections.SUBMITTED_WORKS)
            .find({assignment:objectId(work)}).toArray()
            console.log(assignments)
            resolve(assignments)
        })
    },
    addAnnouncement:(announcement,type)=>{
        return new Promise(async(resolve,reject)=>{
            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let files=type;


            let work= await db.get().collection(collections.ANNOUNCEMENT).findOne({main:announcement.content})

            
            if(work){
                var val=work._id
                db.get().collection(collections.ANNOUNCEMENT).updateOne({main:announcement.content},{
                  
                  $set:{file:files}
                    
                }).then(()=>{
                 resolve(val)
                 //console.log(val)
                })
  
            }
              else{
  
                let obj={
                    main:announcement.content,
                    date:year + "-" + month + "-" + day,
                    file:type 
                }
                db.get().collection(collections.ANNOUNCEMENT).insertOne(obj).then((data)=>{
                    console.log(data.ops[0])
                  resolve(data.ops[0]._id)
                })
            }
            })
    
        },

      








            //db.get().collection(collections.ANNOUNCEMENT).insertOne(obj).then((data)=>{
                //console.log(data.ops[0])
              //resolve(data.ops[0]._id)
           // })
        //})

   // },
    getAnnouncement:()=>{
        return new Promise(async(resolve,reject)=>{
            let value=await db.get().collection(collections.ANNOUNCEMENT).find().toArray()
            resolve(value)
        })
    },
    getWorksdate:(value)=>{
        return new Promise(async(resolve,reject)=>{
            let data=await db.get().collection(collections.STUDENT_ASSIGNED_WORK).find({workdate:value}).toArray()
            resolve(data)
            //console.log(data)
        })
    },
    getPdfdate:(value)=>{
        return new Promise(async(resolve,reject)=>{
            let data=await db.get().collection(collections.STUDENT_ASSIGNED_PDF).find({date:value}).toArray()
            resolve(data)
            //console.log(data)
        })
    },
    dosignup:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            userid.password=await bcrypt.hash(userid.password,10)
            db.get().collection(collections.STUDENT_LOGIN).insertOne(userid).then((data)=>{
                resolve(data.ops[0])
            })
        })
    },
    dologin:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}
            let user=await db.get().collection(collections.STUDENT_LOGIN).findOne({email:userdata.email})
            if(user){
              
                 bcrypt.compare(userdata.password,user.password).then((status)=>{
                     if(status){
                         //console.log("success")
                         response.user=user
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
    },
    addStatus:(status)=>{
        return new Promise(async(resolve,reject)=>{
            let stu=status.topic;
            let att=status.attendance;
            let students=status.student;
            console.log(students)
            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let monthss= date_ob.getMonth()
            let obj={
                topic:stu,
                attendance:att,
                student:students,
                Date:year + "-" + month + "-" + day,
                months:monthss

            }

          let check=await db.get().collection(collections.STATUS).findOne({topic:stu,student:students})
          if(check){
              
            
            db.get().collection(collections.STATUS).updateOne({topic:stu,student:students},
                {
                    $set:{
                       attendance:status.attendance

                    }
                }).then(()=>{
                  resolve(status)
              })
          }else{

          
            db.get().collection(collections.STATUS).insertOne(obj).then((response)=>{
               
                resolve(response.ops[0])
            })
         
        }
            
        })
    },
    getStatus:()=>{
        return new Promise(async(resolve,reject)=>{
            let value=await db.get().collection(collections.STATUS).find().toArray()
            resolve(value)

            
            
        })

    },
    getAttByStudent:(name)=>{
       return new Promise(async(resolve,reject)=>{
        let values=await db.get().collection(collections.STATUS).aggregate([
            {
                $match:{student:name}
            },
            {
                $project:{
                    Date:1,
                    _id:1,
                    attendance:1,
                    student:1
                   
                }
            }
           
        ]).toArray()
        console.log(values)
        resolve(values)
       
        
       

       })
    },
    getAttByStudentid:(id)=>{
        return new Promise(async(resolve,reject)=>{
            
            
            let data= await db.get().collection(collections.STUDENT_COLLECTION).findOne({_id:objectId(id)})
            let students=data.name
            let values=await db.get().collection(collections.STATUS).aggregate([
                {
                    $match:{student:students}
                },
                {
                    $project:{
                        Date:1,
                        student:1,
                        attendance:1,
                        months:1
                    }
                }
               
            ]).toArray()
            
            resolve(values)
           
             
         })

    },
    getmonth:(value)=>{
        console.log(value)
        return new Promise(async(resolve,reject)=>{
            let number=parseInt(value.name)
            console.log(number)
            let values=await db.get().collection(collections.STATUS).
            find({months:number,student:value.student}).toArray()
            console.log(values)
            resolve(values)

            

        })
    },
    getmonths:(value)=>{
        console.log(value)
        return new Promise(async(resolve,reject)=>{
            let number=parseInt(value.name)
            console.log(number)
            let values=await db.get().collection(collections.STATUS).
            find({months:number}).toArray()
            console.log(values)
            resolve(values)

            

        })
    },
    getStatusStart:(user,dates)=>{
        return new Promise(async(resolve,reject)=>{
            let value=await db.get().collection(collections.STATUS).find({Date:dates,student:user,attendance:'present'}).toArray()
            resolve(value)
            console.log(value)

            
            
        })

    },
    addVideo:(video)=>{
        return new Promise((resolve,reject)=>{

            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let obj={
                main:video.head,
                date:year + "-" + month + "-" + day,
               
            }
            db.get().collection(collections.STUDENT_VIDEO).insertOne(obj).then((data)=>{
                //console.log(data.ops[0])
               resolve(data.ops[0]._id)
            })
        })
    },
    getVideo:(value)=>{

        return new Promise(async(resolve,reject)=>{
            let data=await db.get().collection(collections.STUDENT_VIDEO).find({date:value}).toArray()

            resolve(data)
            console.log(data)
        })
    },
    getVideos:()=>{

        return new Promise(async(resolve,reject)=>{
            let value=await db.get().collection(collections.STUDENT_VIDEO).find().toArray()
            resolve(value)

            
            
        })
    },
    addNormal:(cont,names)=>{
        return new Promise(async(resolve,reject)=>{
            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let filename=names
            let work= await db.get().collection(collections.STUDENT_NORMALEVENT).findOne({main:cont.content})

            
            if(work){
                var val=work._id
                db.get().collection(collections.STUDENT_NORMALEVENT).updateOne({main:cont.content},{
                  
                  $set:{file:filename}
                    
                }).then(()=>{
                 resolve(val)
                 //console.log(val)
                })
  
            }
              else{
  
                let obj={
                    main:cont.content,
                    date:year + "-" + month + "-" + day,
                    file:filename 
                }
                db.get().collection(collections.STUDENT_NORMALEVENT).insertOne(obj).then((data)=>{
                    console.log(data.ops[0])
                  resolve(data.ops[0]._id)
                })
            }
            })
},

addPaid:(cont,name)=>{
    return new Promise(async(resolve,reject)=>{
        let date_ob = new Date();
        let day = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let filename=name;


        let work= await db.get().collection(collections.STUDENT_PAYEVENT).findOne({main:cont.content})

        
        if(work){
            var val=work._id
            db.get().collection(collections.STUDENT_PAYEVENT).updateOne({main:cont.content},{
              
              $set:{file:filename}
                
            }).then(()=>{
             resolve(val)
             //console.log(val)
            })

        }
          else{

            let obj={
                main:cont.content,
                date:year + "-" + month + "-" + day,
                amount:cont.price,
                file:filename
            }
            db.get().collection(collections.STUDENT_PAYEVENT).insertOne(obj).then((data)=>{
                console.log(data.ops[0])
              resolve(data.ops[0]._id)
            })
        }
        })
},
getNormalevent:()=>{
    return new Promise(async(resolve,reject)=>{
        let value=await db.get().collection(collections.STUDENT_NORMALEVENT).find().toArray()
        resolve(value)
    })
},
getPayevent:()=>{
    return new Promise(async(resolve,reject)=>{
        let value=await db.get().collection(collections.STUDENT_PAYEVENT).find().toArray()
        resolve(value)
    })
},
addpayment:(payid)=>{
    return new Promise((resolve,reject)=>{
        let obj={
            student:payid.username,
            emailid:payid.email,
            events:payid.event,
            prices:payid.price
        }
        db.get().collection(collections.STUDENT_PAYMENT).insertOne(obj).then((data)=>{
            resolve(data.ops[0])
        })
       
    })
},
addgallery:(view)=>{
    return new Promise((resolve,reject)=>{
    db.get().collection(collections.GALLERY).insertOne(view).then((data)=>{
       
      resolve(data.ops[0]._id)
    })
})
},
getgallery:()=>{
    return new Promise(async(resolve,reject)=>{
        let value=await db.get().collection(collections.GALLERY).find().toArray()
        resolve(value)
    }) 
},
addtoken:(value1,value2,value3,value4)=>{
    return new Promise((resolve,reject)=>{
        let obj={
            name:value1,
            email:value2,
            id:value3,
            money:value4
        }
         db.get().collection(collections.TOKEN).insertOne(obj).then(()=>{
            resolve()
         })
       
    }) 
},
findtoken:(val)=>{
    return new Promise(async(resolve,reject)=>{
        
        let user=await db.get().collection(collections.TOKEN).findOne({id:val})
        
       resolve(user)
    }) 
},
getpic:()=>{
    return new Promise(async(resolve,reject)=>{
        
        let user=await db.get().collection(collections.GALLERY).find().toArray()
        console.log(user)
       resolve(user)
    }) 
}
}