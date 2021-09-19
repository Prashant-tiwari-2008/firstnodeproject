var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator');
//importing controller
const { signout, signup, signin, isSignedIn } = require('../controllers/auth')

//defining routes
router.get('/signout', signout)

router.post('/signup', [
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 char logs"),
    check('email').isEmail().withMessage("Email is not correct"),
    check('password').isLength({ min: 5 }).withMessage("password must container 5 char at least")
], signup)

router.post('/signin', [
    check('email').isEmail().withMessage("Email is not correct"),
    check('password').isLength({ min: 5 }).withMessage("password must container 5 char at least")
], signin)


router.get("/testroute", isSignedIn,(req,res) =>{
    res.send('A PROTECTED ROUTES')
    console.log(req.auth)
})


//export routes
module.exports = router;