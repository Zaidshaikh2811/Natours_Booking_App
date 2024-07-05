/* eslint-disable prettier/prettier */

const User=require('../models/userModel')
const sharp=require('sharp')

const AppError=require('../utils/appError')
const factory=require('./handleFactory')

const  multer=require("multer")
const catchAsync = require('../utils/catchAsync')

// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,"public/img/users");
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1]
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// })

const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb)=>{
   if(file.mimetype.startsWith("image")){
    cb(null,true)
   }
   else{
    cb(new AppError("please Upload and Image",400),false)
   }
}


const  upload=multer({
  storage:multerStorage,
  fileFilter:multerFilter
})

exports.uploadUserPhoto=upload.single('photo')
exports.resizedUserPhoto=catchAsync(async(req,res,next)=>{
  if(!req.file) return next();
req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`);

  next();
})


const filterObj=(obj,allowedFields)=>{
  const newObj={};
Object.keys(obj).forEach(el=>{
  if(allowedFields.includes(el)){
    newObj[el]=obj[el];
  }
})
return newObj;
}

exports.updateMe=async(req,res,next)=>{
  if(req.body.password || req.body.passwordConfirm) return next(new AppError("This Route is not for Password Update .please use /updateMyPassword",400))

    const filteredBody=filterObj(req.body,'name','email')
    if(req.file) filteredBody.photo =req.file.filename;


  const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true})
res.status(200).json({
  status:'success',
  data:{
   updatedUser
  }
})
}

// exports.deleteMe=catchAsync(async(req,res,next)=>{
// await User.findByIdAndUpdate(req.user.id,{active:false});

// res.status(200).json({
//   status:"success"
// })
// })
exports.deleteMe=factory.deleteOne(User)

exports.getAllUsers =factory.getAll(User);
exports.getUsers =factory.getOne(User);
 
exports.getMe=(req,res,next)=>{
  if(!req.user.id) return(next( new AppError("Please Log in")))
  req.params.id=req.user.id;
next()
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'This Route is not Defined! please use /signup',
  });
};
exports.updateUser =factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
