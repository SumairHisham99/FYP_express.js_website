var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { connect } = require('../conn/conn');
var con = require('../conn/conn');


router.get('/postadd', function(req, res, next) {
  if(req.session.flag == 1){
    req.session.destroy();
    res.render('postadd', {message : 'Add Not Posted' , flag : 1});
  }
  else if (req.session.flag == 2){
    res.render('postadd', {message : 'Add Posted. You Can Post New Add Now..', flag : 0});
  }
  else{
    res.render('postadd');
  }
   
});


router.post('/newadd', function(req, res, next){
    
  var name = req.body.name;
  var capacity = req.body.capacity;
  var city = req.body.city;
  var country = req.body.country;
  var address = req.body.address;
  var contact = req.body.contact;
  var category = req.body.category;
  var description = req.body.description;

  if(!req.files){
  
    req.session.flag = 1;
    res.redirect('/postadd');
    
  }else{

    let samplefile = req.files.newimage;
    let uploadpath ='D:/New_Evento/upload/' + samplefile.name;  
    var sql = 'insert into venues(name,capacity,city,country,address,contact,image1,category,description) values(?,?,?,?,?,?,?,?,?);';
      
    samplefile.mv(uploadpath, function(err){
      if(err) throw err;
   
      con.query(sql,[name,capacity,city,country,address,contact,samplefile.name,category,description], function(err, result, fields){
        if(err) throw err;
        req.session.flag = 2;
        res.redirect('/postadd');
        });
    
        });
      }
});

//  Route To Get Venues Data
router.get('/home', function(req, res) {

    var sql = 'SELECT * FROM venues';
  
    con.query(sql, function (err, fields) {
      console.log("fields");
      if (err) {
          console.log(err);  
          throw err;
            
        } else {
          console.log(fields);
          res.render("home", { fields:fields });
          
        }
    })
})


// Route For PostingAdd
router.get('/postadd', function(req, res, next){
  res.render('postadd');
});

module.exports = router;
