const express=require('express');
const router=express.Router()
const MongoClient=require('mongodb').MongoClient;

//connect to mongodb database server
MongoClient.connect("mongodb://127.0.0.1",{ useUnifiedTopology: true },(err,client)=>{
    if(err)
    {
       router.use('',(req,res)=>{
           res.send("Unable to connect to database. Try again later");
       }); 
    }
    else
    {
       //enter database mydb  
       const db=client.db('mydb'); 
        
       //CRUD routes
       router.post('/insert',(req,res)=>{
          var id=req.body.id;

          db.collection('blogs').find({"id":id}).toArray((err,detail)=>{
              if(err)
              res.send("Error in database access");
              else
              {
                if(detail.length==1)
                res.send("cannot insert as record with this id already exists");
                else
                {
                   var title=req.body.title;
                   var blog_category=req.body.blog_category;
                   var l=req.body.list;
                   var list=[];           
          
                   l.forEach(element => {
                        list.push({"type":element.type,"comp":element.comp,"term":element.term});
                   });

                   db.collection('blogs').insertOne({"id":id,"Title":title,"Blog Category":blog_category,"list":list},(error,result)=>{
                       if(error)
                       res.send("Could not insert record! Error in database access");
                       else
                       res.send("Successfully inserted record");
                   });
                }
              }
          });
       });
       router.get('/view',(req,res)=>{
        var id=req.query.id;
        var title=req.query.title;
        if(typeof(id)=='undefined'&&typeof(title)=='undefined')
        {
           db.collection('blogs').find({},{ projection:{"_id":0} }).toArray((error,result)=>{
               if(error)
               res.send("Error in database access");
               else
               res.send(JSON.stringify(result));
           });
        }
        else if(typeof(title)=='undefined')
        {
           db.collection('blogs').find({"id":id},{ projection:{"_id":0} }).toArray((error,result)=>{
               if(error)
               res.send("Error in database access");
               else
               {
                 if(result.length==0)
                 res.send("Record with this id does not exist");
                 else 
                 res.send(JSON.stringify(result));
               }
           });
        }
        else
        {
           db.collection('blogs').find({"Title":title},{ projection:{"_id":0} }).toArray((error,result)=>{
               if(error)
               res.send("Error in database access");
               else
               {
                 if(result.length==0)
                 res.send("No records with this Title is present!");
                 else 
                 res.send(JSON.stringify(result));
               }
           });  
        }
    });
    router.put('/update',(req,res)=>{
        var id=req.body.id;
        var title=req.body.title;
        var blog_category=req.body.blog_category;
        var l=req.body.list;
        var list=[];           

        l.forEach(element => {
           list.push({"type":element.type,"comp":element.comp,"term":element.term});
        });

        db.collection('blogs').updateOne({"id":id},{$set:{"Title":title," Blog Category":blog_category,"list":list}},(error,result)=>{
          if(error)
          res.send("Could not update record! Error in database access");
          else
          res.send("Successfully updated record");
        });
   });
   
   router.delete('/delete',(req,res)=>{
    var id=req.query.id;
    db.collection('blogs').find({"id":id}).toArray((err,detail)=>{
       if(err)
       res.send("Error in database access");
       else
       {
         if(detail.length==1)
         {
            db.collection('blogs').deleteOne({"id":id},(error,success)=>{
                 if(error)
                 res.send("Error during deletion! Could not delete!");
                 else
                 res.send("Record successfully deleted!");   
            }); 
         }
         else
         res.send("Record with this id does not exist! Cannot delete!");
       }
    });
 });

    }       
});
module.exports=router;
