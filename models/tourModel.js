/* eslint-disable no-undef */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const slugify=require("slugify")
const validator=require("validator")
// const User=require("./userModel")

const tourSchema =new mongoose.Schema({
  name:{
    type:String,
    required:[true,"A tour must have a name"],
    unique:true,
       trim:true,
       maxlength:[40,'A tour name must have less or equal than 40 Characters'],
       minlength:[10,'A tour name must have more or equal than 10 Characters'],
      //  validate:validator.isAlpha
  },
  slug:String,
  duration:{
    type:Number,
    required:[true,'A tour must have a duration']
  },
  maxGroupSize:{
    type:Number,
    required:[true,'A Tour Must Have a group Size']
  },
  difficulty:{
    type:String,
    required:[true,'A tour must have a difficulty'],
    enum:{
      values:["easy","medium","difficult"],
    message:"Difficulty is either:easy, medium,difficult"}
  },
  ratingAverage:{
    type:Number,
    default:4.5,
    min:[1,"Rating must be above 1"],
    max:[5,"Rating must be above 5"],
    set:val=>Math.round(val*10)/10
  },
  ratingQuantity:{
    type:Number,
    default:0
  },
  price:{
    type:Number,
    required:[true,"A tour must have a Price"]
  },
  priceDiscount:{
    type:Number,
    validate:{
validator:function(val){
     return this.price>val;
    },
message:"Discount price ({VALUE}) should be less than ActualPrice"
    }
  },
  summary:{
    type:String,
    trim:true,
 required:[true,'A tour must have a description']   
  },
  description:{
type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:[true,'A tour must have a Cover Image']   
  },
  images:[String],
  createdAt:{
    type:Date,
    default: Date.now(),
  },
  startDates:[Date]
  ,
  secreteTour:{
    type:Boolean,
    default:false
  },
  startLocation:{
    type:{
      type:String,
      default:'Point',
      enum:['Point']
    },
    coordinates:[Number],
    address:String,
    description:String
  },
locations:
[

  {
    type:
    {
      type:String,
    default:'Point',
    enum:['Point']
    },
    coordinates:[Number],
    address:String,
    description:String,
    day:Number
  }
],
guides:[
  {type:mongoose.Schema.ObjectId,
  ref:'User'
  }
],


},
{
  toJSON:{
    virtuals:true
  },
  toObject:{
    virtuals:true
  }
})
tourSchema.index({price:1,ratingAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation:'2dsphere'});


tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7
})

tourSchema.pre('save', function (next) {
this.slug=slugify(this.name,{
  lower:true
});
next();
}
)

tourSchema.index({price:1})

tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
})


tourSchema.pre(/^find/,function(next){
  this.find({ secreteTour : {$ne:true}});
  next()
})
tourSchema.pre(/^find/,function(next){
        this.populate({path:'guides',
  select:'-__v -passwordChangedAt'
  });
    next();
});

// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();
// })


// tourSchema.pre('aggregate',function(next){
//   this.pipeline().unshift({
//     $match:  { secreteTour : {$ne:true}}
//   })
//   next()
// })

const Tour=mongoose.model('Tour',tourSchema)

module.exports=Tour