const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { isValidPassword, createHash } = require('../utils/bCrypt');
const User = require('../models/User');

const authRouter = express.Router();

passport.use('login', new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
        console.log(user);

        if (err) {
            return done(err);
        }

        if (!user) {
            console.log('User not found');
            return done(null, false);
        }

        if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            return done(null, false);
        }

        return done(null, user)
    })
}));

passport.use('register', new LocalStrategy({ passReqToCallback: true },
    (req, username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
            if (err) {
                console.log(`Error ${err}`);
                return done(err);
            }

            if (user) {
                console.log('User already exists');
                return done(null, false);
            }

            const newUser = {
                username: username,
                password: createHash(password),
                email: req.body.username
            }

            User.create(newUser, (err, userCreated) => {
                if (err) {
                    console.log(`Error ${err}`);
                    return done(err);
                }

                console.log(user);
                console.log('Successful registration');
                return done(null, userCreated);
            })
        })
    }));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});


authRouter.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('../views/pages/login.ejs')
    }
});

authRouter.get('/failLogin', (req, res) => {
    res.render('../views/pages/failLogin.ejs');
});

authRouter.get('/logOut', (req, res) => {
    const email = req.user.email;
    req.session.destroy(err =>{
        if(!err){
            res.render('../views/pages/logOut.ejs', { email });
        } else {
            res.render('../views/pages/login.ejs');
        }
    });
});

authRouter.get('/register', (req, res) => {
    res.render('../views/pages/register.ejs');
});

authRouter.get('/failRegister', (req, res) => {
    res.render('../views/pages/failRegister.ejs');
});

authRouter.post('/auth/local', passport.authenticate('login', { failureRedirect: '/failLogin' }),
    (req, res) => {
        res.redirect('/');
    }
);

authRouter.post('/signin/local', passport.authenticate('register', { failureRedirect: '/failRegister' }),
    (req, res) => {
        res.redirect('/login')
    }
);


module.exports = authRouter;