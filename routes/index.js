var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
mongoose.Promise = global.Promise;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('success!');
});

router.get('/testMongo',function(req,res,next){
  const point=new LatLongData({
    location:{
      lat:200,
      lng:200
    },
    timestamp:'TEST ENTRY'
  })
  point.save()
  .then(()=>{
      res.send({
          success:true,
          message:"data added successfully"
      })
  })
  .catch(err =>{
      console.log(err);
      res.send(
          {sucess:false,
            message:'data did not add to DB'
          }
      );
  });

})

module.exports = router;

