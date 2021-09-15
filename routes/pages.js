const express = require('express');
const User = require('../core/user');
const db = require('../core/db');
const router = express.Router();

// create an object from the class User in the file core/user.js
const user = new User();

// Get the index page
router.get('/', (req, res, next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    if(user){
        if(user.role_name =='admin') {
            res.render('adminPage', {user: user.username});
            return;
        }
        res.render('index',{user: user.username});
    }
    // IF not we just send the index page.
    res.render('index',{user: null});

})
//GET request to about page
router.get('/about',(req, res,next) => {
    //Send the about page with user variable
    res.render('about', {user: req.session.user});
});
//GET Request to contact page
router.get('/contact',(req, res,next) => {
    res.render('contact', {user: req.session.user});
});
 //Get home page
router.get('/logon', (req, res, next) => {

    res.render('logon', {user: req.session.user,passwordFail: false});
});

// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    user.login(req.body.username, req.body.password, function(result) {
        if(result) {
            // Store the user data in a session.
            req.session.user = result;
            // redirect the user to the home page.
            if(result.role_name == 'admin'){
                res.render('adminPage',{user: result.username});
            }
            if(result.role_name == 'guest'){
                res.render('about',{user: result.username});
            }
            if(result.role_name == 'ordinary'){
                res.render('contact',{user: result.username});
            }
        }else {
            // if the login function returns null send this error message back to the user.
            res.render("logon",{user:null,passwordFail:true});
        }
    })

});


// Post register data
router.post('/register', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        username: req.body.username,
        role: req.body.role,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.create(userInput, function() {
        res.send('User created.');
    });

});
router.post('/delete', (req, res, next) => {
    // prepare an object containing all user inputs.

    // call create function. to create a new user. if there is no error this function will return it's id.
    user.delete(req.body.username, function() {
        res.send('User deleted.');
        if(req.body.username = req.session.user){
            req.session.destroy();
        }
    });

});


// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;