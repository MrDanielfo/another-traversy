const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs'); 
const passport = require('passport'); 

// Bring in User Model

let User = require('../models/user');

// Register Form 
// Add Route
router.get('/register', (req, res) => {
    res.render('register_user', {
        title: 'Register your self'
    });
});

// Register User

router.post('/register', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2; 

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
          errors: errors,
          title: 'Register yourself'
        });
    } else {

        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err) {
                    console.log(err); 
                } 

                newUser.password = hash; 
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and  can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
}); 

// Route for login

router.get('/login', (req, res) => {
  res.render('login_user', {
    title: 'Login'
  });
});


// Validando los datos del login
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); 

});

//Logout

router.get('/logout', (req, res) => {
    req.logOut(); 
    req.flash('success', 'Now you are logged out, come back soon');
    res.redirect('/users/login');
})

module.exports = router; 