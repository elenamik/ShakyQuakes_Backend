const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const LatLongSchema = new mongoose.Schema({
    location: {
        lat:{
            type: Number,
            trim: true,
        },
        lng:{
            type: Number,
            trim: true,
        }
    },
    timestamp:{
        type: String
    },
    photo:{
        type:String
    }
    
  });

  module.exports = mongoose.model('LatLongData', LatLongSchema);