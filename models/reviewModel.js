/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const Tour = require("./tourModel");


const reviewSchema=new mongoose.Schema({
review:{
    type:String,
required:[true,"Review can not be Empty"]
},
rating:{type:Number,
min:1,
max:5
},
createdAt:{type:Date,
default:Date.now
},
tour:[
     {type:mongoose.Schema.ObjectId,
  ref:'Tour',
  required:[true,"Review Must be to a tour"]
  }
],
user:[
     {type:mongoose.Schema.ObjectId,
  ref:'User',
  required:[true,"Review Must be to a User"]
  }
]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.pre(/^find/,function(next){
  this.populate({path:'user',select:'name photo'});
  next()
}) 
// tourSchema.pre(/^find/,function(next){
//         this.populate({path:'guides',
//   select:'-__v -passwordChangedAt'
//   });
//     next();
// });

reviewSchema.index({tour:1,user:1},{
  unique:true
})


reviewSchema.statics.calcAverageRatings=async function(tourId){
 const stats=await this.aggregate([
    {
      $match:{tour:tourId}
    },
    {
      $group:{
        _id:`$tour`,
        nRating:{$sum:1},
        avgRating:{$avg:'$rating'}
      }
    },
   
  ]);
  if(stats.length>0){

    await Tour.findByIdAndUpdate(tourId,{
      ratingQuantity:stats[0].nRating,
      ratingAverage:stats[0].avgRating
    })
  }else{
     await Tour.findByIdAndUpdate(tourId,{
      ratingQuantity:0,
      ratingAverage:4.5
    })
  }
}

reviewSchema.post('save',function(){
  

  this.constructor.calcAverageRatings(this.tour); 
  
})

reviewSchema.pre(/^findOneAnd/,async function(next){

this.r=await this.findOne()

next()
})
reviewSchema.post(/^findOneAnd/,async function(next){

 this.constructor.calcAverageRatings(this.r.tour)

})


const Review=mongoose.model('Review',reviewSchema)

module.exports=Review