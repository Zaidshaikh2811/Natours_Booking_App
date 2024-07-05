/* eslint-disable prettier/prettier */
const mongoose=require("mongoose")
const crypto=require('crypto')
const validator=require("validator")
const bcrypt=require("bcryptjs")


const userScheme=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter the Name"]
    },
    email:{
        type:String,
         required:[true,"Enter the email"],
         unique:true,
         lowercase:true,
         validate:[validator.isEmail,"PLease Provide a valid Email"]
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,"Please Provide the Password"],
        minlength:8,
        select:false
       
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please Confirm Your Password"],
         validate:{
            validator:function(el){
                return el === this.password;
            },
            message:"Password are not the same"
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpire:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
    
})

userScheme.pre('save',async function(next){

    if(!this.isModified('password')) return;

    this.password= await bcrypt.hash(this.password,12)
this.passwordConfirm=undefined
    next()
})

userScheme.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userScheme.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt=Date.now()-1000;
    next();

})

userScheme.pre(/^find/,function(next){

    this.find({active:{$ne:false}})
    next();
});


userScheme.methods.changedPasswordAfter= function (JWTTimestamp) {
if(this.passwordChangedAt){
const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10)

     return JWTTimestamp<changedTimeStamp;
}
return false;

   
}
userScheme.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire=Date.now()+10*60*1000;

    return resetToken;

}

const User=mongoose.model( "User",userScheme)

module.exports=User;