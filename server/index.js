import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { Avatar } from '../client/src/avatar.js';
import enemi from './enemis.js';

const app = express();

let canvasSize;

let canLostLifeAvatar = true;
let canLostLifeEnemi = true;

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
let canShoot = true;
let LVL2start = false;

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

	socket.on('shoot', shoot => {
		const playerAvatar = avatars.find(avatar => avatar.nom === shoot.id);

		if (canShoot) {
			playerAvatar.tirer();
			canShoot = false;
			setTimeout(function () {
				canShoot = true;
			}, 100);
		}
	});

	socket.on('LVL2', LVL2start => {
		LVL2start = true;
	});

	socket.on('canvasSize', canvasSize => {
		console.log(canvasSize);
		canvasSize = canvasSize;
	});
});

let spawnIntervalLV1 = setInterval(() => {
	let randomY = Math.random() * (150 - 0) + 0;
	do {
		randomY = Math.random() * (150 - 0) + 0;
	} while (randomY > 300 - 57);
	const newEnemy = new enemi(1500 - 69, randomY, 0, 1);
	enemis.push(newEnemy);
}, 1000);

let spawnIntervalLV2 = setInterval(() => {
	if (LVL2start) {
		let randomY = Math.random() * (1500 - 0) + 0;
		do {
			randomY = Math.random() * (canvas.height - 0) + 0;
		} while (randomY > 1500 - 100);
		const newEnemy = new enemi(1500 - 100, randomY, 1, 2);
		enemis.push(newEnemy);
	}
}, 800);

setInterval(() => {
	io.emit('enemis', enemis);

	let avatarData = [];
	avatars.forEach(avatar => {
		enemis.forEach(enemi => {
			if (LVL2start) {
				console.log('ouais');
				enemi.setVx(10);
				enemi.setVy(4);
			}
			if (enemi.hitbox.colision(avatar.hitbox)) {
				if (canLostLifeAvatar) {
					avatar.decrementScore(5);
					enemis.splice(enemis.indexOf(enemi), 1);
					avatar.perdreVie();
					canLostLifeAvatar = false;
					setTimeout(function () {
						canLostLifeAvatar = true;
					}, 100);
				}
				if (avatar.getVies() == 0) {
					//afficherFinDePartie();
					avatar.initAvatar();
					//t = new timer();
				}
			}
			if (enemi.getVies() < 0) {
				avatar.incrementScore(5);
				enemis.splice(enemis.indexOf(enemi), 1);
			}
			enemi.deplacer();
			avatar.colision(enemi.hitbox);
			avatar.projectiles.forEach(projectile => {
				if (projectile.hitbox.colision(enemi.hitbox)) {
					avatar.projectiles.splice(avatar.projectiles.indexOf(projectile), 1);
					if (canLostLifeEnemi) {
						enemi.perdreVie();
						canLostLifeEnemi = false;
						setTimeout(function () {
							canLostLifeEnemi = true;
						}, 1000 / 60);
					}
				}
			});
		});
		avatar.deplacer();
		avatar.projectiles.forEach(projectile => projectile.deplacer());
		avatarData.push({
			id: avatar.id,
			x: avatar.getX(),
			y: avatar.getY(),
			projectiles: avatar.projectiles,
		});
	});
	io.emit('avatarsData', avatarData);
}, 1000 / 60);
