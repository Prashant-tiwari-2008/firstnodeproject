//accessing model to save data
const User = require('../models/user')
const { check, validationResult } = require('express-validator');
const { param } = require('../routers/auth');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')



exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User SignOut"
    })
}

exports.signup = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            eroorMsg: errors.array()[0].msg,
            errorParam: errors.array()[0].param,

        })
    }
    const user = new User(req.body);
    console.log(`user info ${user}`);
    user.save((err, user) => {
        if (err) {
            res.status(400).json({
                err: "NOT ABLE TO SAVE INTO DATABASE"
            })
        }
        res.json(user);
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req)
    const { email, password } = req.body;
    console.log(password, 'controller password');
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMsg: errors.array()[0].msg,
            errorParam: errors.array()[0].param,

        })
    }
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "user email does not exist"
            })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "given password is not correct"
            })
        }

        //token created
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //putting token in to the cookies
        res.cookie("token", token, { expire: new Date() + 999 })

        //sending response to front end
        const { _id, name, email, role } = user;
        return res.status(200).json({
            token, user: { _id, name, email, role }
        })
    })

}

//protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",

})


//Custom middleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id 
    if(!checker){
        return res.status(403).json({
            error :" ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"ACCESS DENIED, Only admin can access this. are you admin ?"
        })
    }

    next()
}