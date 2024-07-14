/* eslint-disable prettier/prettier */
const User = require("../models/userModel")
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const { promisify } = require('util')
const Email = require('./../utils/email')
const crypto = require('crypto');



const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })

const createSendToken = (user, statusCode, req, res) => {

    const token = signToken(user._id)



    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),

        httpOnly: true,
        secure: req.secure || req.headers('x-forwarded-proto') === 'https'
    })
    user.password = undefined
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })

}

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser= await User.create({
    //     name:req.body.name,
    //     email:req.body.email,
    //     password:req.body.password,
    //     passwordConfirm:req.body.passwordConfirm,
    //     passwordChangedAt:req.body.passwordChangedAt,
    //     role:req.body.role,
    // });
    const newUser = await User.create(req.body);
    const url = `${req.protocol}://${req.get('host')}/me`;

    new Email(newUser, url).sendWelcome();

    createSendToken(newUser, req, 201, res);


});


exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    // 1) check if email and password are provided
    if (!email || !password) {
        return next(new AppError('please Provide Email and Password'))
    }

    const users = await User.findOne({ email }).select('+password');

    if (!users || !(await users.correctPassword(password, users.password))) {
        return next(new AppError('Invalid Email or password', 401))
    }
    createSendToken(users, req, 200, res);

})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError("You are not Logged in Please Logged in to get access", 401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const freshUser = await User.findById(decoded.id)

    if (!freshUser) {
        return next(new AppError('The User does not longer Exist'))
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User Recently Changed", 401))
    }
    req.user = freshUser;
    res.locals.user = freshUser;
    next();
})

exports.isLoggedIn = async (req, res, next) => {

    if (req.cookies.jwt) {
        try {


            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            const freshUser = await User.findById(decoded.id)

            if (!freshUser) {
                return next();
            }

            if (freshUser.changedPasswordAfter(decoded.iat)) {
                return next()
            }
            res.locals.user = freshUser;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
}




exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: "success" })
}

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(
            new AppError("You Do Not Have permission to perform this action", 404)
        );
    }
    next();
};



exports.forgotPassword = catchAsync(async (req, res, next) => {

    //1 check if the user exists and the email is correct
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError("There is no user with email", 404))

    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password ? submit  a Patch request with your new password  and confirm Password at ${resetURL}.\nid you didn't forget your password ,please ignore this email`;

    try {


        await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: 'Token Send to email'
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;

        await user.save({ validateBeforeSave: false })
        return next(new AppError("There was an error sending Email", 500))
    }
})
exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new AppError("Token is Invalid or expired", 400))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpire = undefined
    await user.save();

    createSendToken(user, req, 200, res)
})



exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError("Your Current Password is Wrong", 401))

    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    createSendToken(user, req, 200, res)
})