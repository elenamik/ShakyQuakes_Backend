var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const LatLongData = mongoose.model('LatLongData');


router.get('/populateLocations', function(req,res,next){
  const base=[{lat:-25.000,lng:133.000},{lat:-34.000,lng:150.000},{lat:29.000,lng:84.000},{lat:32.000,lng:117.000}]

  const regions=Number(req.query.regions) || 1
  const points=Number(req.query.points) || 1
  const data_points=[]
  console.log(`generating ${points} points for ${regions} regions`)

  for (let i=1; i<=regions; i++){
    index=Math.floor(Math.random() * base.length )//need it to be between 0 and length
    const basePoint=base[index]
  
    for (let j=1; j<=points ;j++){
      // lat
      const b1=basePoint.lat
      const sign1=Math.pow(-1,2) //(-1) to power of random number between 1 and 2
      const distance1=Math.random()/10 //random .01 decimal
      const lat=b1+sign1*distance1
    
      // //lng
      const b2=basePoint.lng
      const sign2=Math.pow(-1,2) //(-1) to power of random number between 1 and 2
      const distance2=Math.random()/10 //random .01 decimal
      const lng=b2+sign2*distance2
     
      //ts
      var today = new Date();
      var date = String(today.getFullYear())+'-'+(padZero(today.getMonth()+1))+'-'+padZero(today.getDate());
      var time = padZero(today.getHours()) + ":" + padZero(today.getMinutes()) + ":" + padZero(today.getSeconds());
      var timestamp= date+' '+time;

      //photo
      //filename should get generated randomly and stored in memory. for now we only have 3 photos
      const filenum=String(Math.floor(Math.random() * 2 +1))
      const filename=`human${filenum}.jpg`
      console.log('FILE NAME',filename)

      const point=new LatLongData({
        location:{
          lat,
          lng
        },
        timestamp,
        photo:filename
      });
        data_points.push(point)
      }
  }
  console.log(data_points)
  LatLongData.collection.insertMany(data_points)
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


router.get('/getLocations',function(req,res){
  console.log("")
  const lowerBound=req.query.lowerBound;
  const upperBound=req.query.upperBound;
  console.log(`querying location points for results between ${lowerBound} and ${upperBound}`)
  LatLongData.find(
    {
      timestamp:{
        $gte:lowerBound,
        $lte:upperBound
      }
    }
  ).then(results=>{
    console.log(results)
    res.send(
      {success:true,
        locations:results
    })
  })
  .catch(err=>{
    console.log(err)
    res.send({
      success:false,
      message:"coult not fetch from DB"
    })
  })
})

function padZero(value){
  if (value<=9){
      value=`0${value}`
  }
  return value;
}

module.exports = router;

