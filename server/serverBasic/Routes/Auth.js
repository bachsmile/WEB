const express =require('express');//thu vien
const router =express.Router();//thu vien
const AuthController = require('../App/Controllers/Http/AuthController');
const {validationResult} = require('express-validator')
const registerValidator = require('../App/Validators/registerValidator')

// router.post('/register', registerValidator,(req,res,next)=>{
//     const errors = validationResult(req);
//     console.log(errors);
//     AuthController.register({req,res,next});
// })
router.post('/login',(req,res,next)=>{
    AuthController.login({req,res,next});
})

module.exports = router;