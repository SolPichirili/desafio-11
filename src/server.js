const express = require('express');
const session = require('express-session');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const fakerProducts = require('../public/js/products');
const authRouter = require('./routers/auth');

const { getMessages, saveMessages } = require('./models/messages');
const { authMiddleware } = require('./middlewares/auth');

const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const server = express();
const httpServer = new HttpServer(server);
const io = new SocketServer(httpServer);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

server.set('view engine', 'ejs');

server.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/ecommerce' }),
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

server.use(passport.initialize());
server.use(passport.session())

server.use(authRouter);

let port = process.env.PORT || 8080;

io.on('connection', async (socket) => {
    console.log('Nuevo usuario conectado.');

    const messages = await getMessages();
    socket.emit('messages', messages);

    socket.on('new-message', async (message) => {
        await saveMessages(message);
        const messages = await getMessages();

        io.sockets.emit('messages', messages);
    });
});

server.get('/', authMiddleware, (req, res) => {
    res.render('../views/pages/index.ejs', {
        email: req.body.email
    });
});

server.get('/api/productos-test', (req, res) => {
    const products = fakerProducts;
    res.render('../views/pages/products.ejs', {
        productos: products
    });
});

mongoose.connect('mongodb://localhost:27017/ecommerce',
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        if (err) {
            console.error('Error Mongo');
        }
    });

const app = httpServer.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});

app.on('error', (error) => {
    console.log(`Error: ${error}`);
});