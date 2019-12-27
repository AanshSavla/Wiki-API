// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("Article",articleSchema);

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.route("/articles")
.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(err){
      console.log(err);
    }else{
      res.send(foundArticles);
    }
  });
})
.post(function(req,res){
const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Article sent successfully");
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Deleted articles successfully");
    }
  });
});

app.route("/articles/:articleName")
.get(function(req,res){
  Article.findOne({title:req.params.articleName},function(err,foundArticle){
    if(err){
      res.send(err);
    }
    else{
      res.send(foundArticle);
    }
});
})
.put(function(req,res){
  Article.update({title:req.params.articleName},
    {title:req.body.title,content:req.body.content},
   {overwrite:true},
 function(err){
   if(err){
     res.send(err);
   }
   else{
     res.send("Succesfully updated the data.");
   }
 });
})
.patch(function(req,res){
  Article.update({title:req.params.articleName},
  {$set:req.body},
    function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("Succesfully Update");
      }
    });
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.title},function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Succesfully deleted.");
    }
  });
});


app.listen(3000,function(){
  console.log("Server started on port 3000.");
});
