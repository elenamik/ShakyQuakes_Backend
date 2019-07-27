var express = require('express');
var router = express.Router();
let {PythonShell} = require('python-shell')
const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const LatLongData = mongoose.model('LatLongData');
var isEqual = require('lodash.isequal');
const pythonPath="python-env/bin/python"

/* GET home page. */
router.get('/test', function(req, res) {
    res.send('success!');
  });


router.get('/checkForHuman', function(req,res){
  const imgName='human2.jpg'
  // for future: request will take a photo filename as a param (saved in a temp folder to analyze)
  // const imgName=req.body.imageName

  let options = {
    mode: 'text',
    pythonPath,
    scriptPath: 'bin',
    args: [imgName]
  }
    console.log(`Running analysis on ${imgName}`)

     PythonShell.run('human_detection_model.py', options, function (err, results) {
      if (err) {
        console.log(err)
        res.send({
          success:false,
          error:err
        })
      }
      // Results is an array consisting of messages collected during execution
      console.log('results: %j', results)
      res.send({success:true,
        results})
    })
})

router.get('/predict',function(req,res){
  const radon_data='data/radon_data.csv'
  const earthquake_radon='data/earthquake_radon.csv'
  // for future: request will take csv file names as parameters (saved in a temp folder to analyze)
  // const radon_data=req.body.radon_data
  // const earthquake_radon=req.body.earthquake_radon

  let options = {
    mode: 'text',
    pythonPath,
    scriptPath: 'bin',
    args: [radon_data,earthquake_radon]
  }

  PythonShell.run('earthquakes_radon_anomaly.py', options, function (err, results) {
    if (err) {
      console.log(err)
      res.send({
        success:false,
        error:err
      })
    }
    // Results is an array consisting of messages collected during execution
    console.log('results: %j', results)
    const amnt_found=Number(results[2])
    const quake_info=[]
    let result_obj={}
    //start reading result at 3
    for (let sectionIndex=0 ;sectionIndex<amnt_found;sectionIndex++){
        let ptr=4
        result_obj={
          date: results[ptr],
          magnitude:results[ptr+1],
          center:results[ptr+2],
          location:{
            lat:results[ptr+3],
            lng:results[ptr+4],
          },
          radon_level:results[ptr+5]
        }
        ptr=ptr+7
        if (isUnique(quake_info,result_obj)){
          quake_info.push(result_obj)
        }
        
    }
    console.log(quake_info)
    res.send({success:true,
      quake_info})
  })
})

function isUnique(arr,new_elem){
  for (let i=0;i<arr.length;i++){
    if (isEqual(arr[i],new_elem)){
      return false
    } 
  }
  return true
}

module.exports = router;

