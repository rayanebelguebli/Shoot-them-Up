import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { Avatar } from '../client/src/avatar.js';
import enemi from './enemis.js';
import { Coordinate } from '../client/src/Coordinate.js';
import timer from './timer.js';
import Bonus from './bonus.js';
import { bonusImages, bonusNoms, bonusTaille } from '../client/src/utils.js';

const app = express();

let canvasSize = new Coordinate(1920, 1261);

let canLostLifeAvatar = true;
let canLostLifeEnemi = true;
let gameStarted = false;

let t = new timer();

const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };
addWebpackMiddleware(app);

const io = new IOServer(httpServer);

app.use(express.static('client/public'));

const port = process.env.PORT == null ? 8000 : process.env.PORT;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

setInterval(function () {
	if (gameStarted) {
		t.addTime();
		io.emit('timer', t.getMin(), t.getSec());
	} else {
		t = new timer();
	}
}, 1000);

const avatars = [];
const enemis = [];
const bonusArray = [];

let cpt = 0;
let canShoot = true;
let LVL2start = false;
let LVL3start = false;

io.on('connection', socket => {
	cpt++;
	if (cpt <= 4) {
		const avatar = new Avatar(`${socket.id}`, cpt);
		io.emit('newAvatar', { id: cpt, x: avatar.getX(), y: avatar.getY() });
		avatars.push(avatar);

		socket.on('disconnect', () => {
			avatars.forEach(avatar => {
				if (avatar.nom == socket.id) {
					console.log('taille du tableau : ' + avatars.length);
					io.emit('disconnectEvent', avatar.id);
					avatars.splice(avatars.indexOf(avatar), 1);
					console.log('taille du tableau : ' + avatars.length);
				}
			});
			console.log(`Déconnexion du client ${socket.id}`);
		});

		socket.on('start', s => {
			console.log(s);
			if (s == true && cpt != 0) {
				gameStarted = s;
			} else if (cpt == 0) {
				gameStarted = false;
			}
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
				}, 200);
			}
		});

		socket.on('canvasSize', canvasSize => {
			console.log(canvasSize);
			canvasSize = canvasSize;
		});
	}
});

let spawnIntervalLV1 = setInterval(() => {
	if (gameStarted) {
		if (t.getMin() >= 1) {
			LVL2start = true;
		}
		if (t.getSec() >= 30) {
			LVL3start = true;
		}

		let randomY = Math.random() * (canvasSize.height - 0) + 0;
		do {
			randomY = Math.random() * (canvasSize.height - 0) + 0;
		} while (randomY > canvasSize.height - 57);
		const newEnemy = new enemi(canvasSize.width, randomY, 0, 1);
		enemis.push(newEnemy);
	}
}, 1000);

let spawnIntervalLV2 = setInterval(() => {
	if (LVL2start && gameStarted) {
		let randomY = Math.random() * (canvasSize.height - 0) + 0;
		do {
			randomY = Math.random() * (canvasSize.height - 0) + 0;
		} while (randomY > canvasSize.height - 100);
		const newEnemy = new enemi(canvasSize.width - 100, randomY, 1, 2);
		enemis.push(newEnemy);
	}
}, 800);

let spawnIntervalLV3 = setInterval(() => {
	if (LVL3start && gameStarted) {
		let randomY = Math.random() * (canvasSize.height - 0) + 0;
		do {
			randomY = Math.random() * (canvasSize.height - 0) + 0;
		} while (randomY > canvasSize.height - 100);
		const newEnemy = new enemi(canvasSize.width - 100, randomY, 1, 3);
		enemis.push(newEnemy);
	}
}, 4000);

let spawnBonusInterval = setInterval(() => {
	if (gameStarted) {
		let randomX;
		let randomY;
		const choix = Math.floor(Math.random() * bonusNoms.length);
		do {
			randomY = Math.random() * (canvasSize.height - 0) + 0;
		} while (randomY > canvasSize.height - 75);
		do {
			randomX = Math.random() * (canvasSize.width - 0) + 0;
		} while (randomX > canvasSize.width - 75);
		const bonus = new Bonus(choix, 1, randomX, randomY, t.getTotalTime());
		bonusArray.push(bonus);
	}
}, 15000);

setInterval(() => {
	io.emit('enemis', enemis);
	io.emit('bonusArray', bonusArray);

	let avatarData = [];
	avatars.forEach(avatar => {
		avatar.canvasSize = canvasSize;
		if (
			avatar.getStatut() == 'invincibilite' &&
			t.getTotalTime() - avatar.getStatutTime() == 15
		) {
			avatar.setStatut('null');
		}
		enemis.forEach(enemi => {
			if (
				enemi.hitbox.colision(avatar.hitbox) &&
				avatar.getStatut() != 'invincibilite'
			) {
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
			vies: avatar.getVies(),
			score: avatar.getScore(),
		});
		bonusArray.forEach(bonus => {
			if (bonus.hitbox.colision(avatar.hitbox)) {
				if (bonusNoms[bonus.getChoix()] == 'vie') {
					avatar.gagnerVie();
				} else if (bonusNoms[bonus.getChoix()] == 'invincibilite') {
					avatar.setStatut('invincibilite');
					avatar.setStatutTime(t.getTotalTime());
				}
				bonusArray.splice(bonusArray.indexOf(bonus), 1);
			}
			if (bonus.estExpire(t.getTotalTime())) {
				bonusArray.splice(bonusArray.indexOf(bonus), 1);
			}
		});
	});
	io.emit('avatarsData', avatarData);
}, 1000 / 60);
