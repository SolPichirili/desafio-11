const express = require('express');

const authRouter = express.Router();

authRouter.get('/register', (req, res)=>{
    res.render('../views/pages/register.ejs')
});

authRouter.get('/login', (req, res) => {
    const nombre = req.session?.nombre;
    if (nombre) {
        res.redirect('/', { nombre })
    } else {
        res.render('../views/pages/login.ejs')
    }
});

authRouter.get('/logout', (req, res) => {
    const nombre = req.session?.nombre;
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {
                res.render('../views/pages/logout.ejs', { nombre })
            } else {
                res.redirect('/login')
            }
        })
    } else {
        res.redirect('/login');
    }
})

authRouter.post('/login', (req, res) => {
    req.session.nombre = req.body.username;
    res.redirect('/');
});



module.exports = authRouter;