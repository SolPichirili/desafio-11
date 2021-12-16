const express = require('express');
const session = require('express-session');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const fakerProducts = require('../public/js/products');
const authRouter = require('./routers/auth');

const { getMessages, saveMessages } = require('./models/messages');
const { authMiddleware } = require('./middlewares/auth')

const server = express();
const httpServer = new HttpServer(server);
const io = new SocketServer(httpServer);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

server.set('view engine', 'ejs');

server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

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
        nombre: req.session.nombre
    });
});

server.get('/api/productos-test', (req, res) => {
    const products = fakerProducts;
    res.render('../views/pages/products.ejs', {
        productos: products
    });
});

const app = httpServer.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});

app.on('error', (error) => {
    console.log(`Error: ${error}`);
});