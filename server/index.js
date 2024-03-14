import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';

const app = express();

const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };
addWebpackMiddleware(app);

const io = new IOServer(httpServer);
io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});
});

app.use(express.static('client/public'));

const port = process.env.PORT == null ? 8000 : process.env.PORT;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
