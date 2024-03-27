import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { Avatar } from '../client/src/avatar.js';

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

const avatars = [];
const enemis = [];

let cpt = 0;

io.on('connection', socket => {
	cpt++;
	console.log(cpt);
	const avatar = new Avatar(`${socket.id}`, cpt);
	console.log('Connexion du client' + socket.id);
	io.emit('newAvatar', { id: cpt, x: avatar.getX(), y: avatar.getY() });
	avatars.push(avatar);
	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});

	socket.on('clickEvent', clickEvent => {
		const playerAvatar = avatars.find(avatar => avatar.nom === clickEvent.id);
		if (playerAvatar) {
			playerAvatar.click[clickEvent.key] = clickEvent.pressed;
		} else {
			console.log(`Aucun avatar trouvé avec le nom ${clickEvent.id}`);
		}
	});

	socket.on('canvasSize', canvasSize => {
		avatar.canvasSize = canvasSize;
		console.log(canvasSize);
	});
});

setInterval(() => {
	io.emit('enemis', enemis);

	let avatarData = [];
	avatars.forEach(avatar => {
		avatar.deplacer();
		//avatar.projectiles.forEach(projectile => projectile.deplacer());
		avatarData.push({
			id: avatar.id,
			x: avatar.getX(),
			y: avatar.getY(),
			//projectiles: avatar.projectiles,
		});
	});
	io.emit('test', avatarData);
}, 1000 / 60);
