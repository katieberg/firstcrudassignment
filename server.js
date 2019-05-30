const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs')
const port = process.env.PORT || 8000;

let storage = require('./storage.json');//this is an array of objects
app.use(bodyParser.json());

app.get('/users',function(req,res){
  res.send(storage)
})


app.get('/users/:name',function(req,res){
  let searchName=req.params.name;
  for(let el of storage){
    if (el.name==searchName){
      res.send(el)
      return;
    }
  }  
  res.sendStatus(404)
})

app.post('/users',function(req,res){
  let newObj=req.body;
  if(!newObj||!newObj.name||!newObj.email||!newObj.state){//or no name, email, state!!
    return res.sendStatus(400);
  }
  else{
    for(let i=0;i<storage.length;i++){
      if(storage[i].name==req.body.name){//make sure this is working when we try to post the same name we already have
        return res.sendStatus(405)
      }
    }
    storage.push(newObj);
    res.send(newObj);
  }
  
})

app.put('/users/:name',function(req,res){//the body should be an object that includes the name, em and state.
  var nameToReplace=req.params.name;
  var updatedObj = req.body
  if(!updatedObj||!updatedObj.name||!updatedObj.email||!updatedObj.state){//or no name, email, state!!
    return res.sendStatus(400);
  }
  else{
    for(let i=0;i<storage.length;i++){
      if(storage[i].name==nameToReplace){
        storage[i].name=req.body.name;
        storage[i].state=req.body.state;
        storage[i].email=req.body.email;
        return res.json(req.body);
      }
    }
    return res.sendStatus(404); 
  }
})

app.delete('/users/:name',function(req,res){
  var nameToDelete=req.params.name;
  for(let i=0;i<storage.length;i++){
    if(storage[i].name===nameToDelete){
      var deleted=storage.splice(i,1)
      return res.send(deleted);
    }
  }
  res.sendStatus(404); 
})

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
})
