// server.js
import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { Avatar } from '../common/avatar.js';
import enemi from './enemis.js';
import { Coordinate } from '../common/Coordinate.js';
import timer from './timer.js';
import Bonus from './bonus.js';
import { bonusImages, bonusNoms, bonusTaille } from '../common/utils.js';

const app = express();
const httpServer = http.createServer(app);
const io = new IOServer(httpServer);

const canvasSize = new Coordinate(1920, 1261);
let gameStarted = false;
let t = new timer();
let canLostLifeAvatar = true;
let canLostLifeEnemi = true;
let firstAvatar = false;
let cptConnexion = 0;
let canShoot = true;
let LVL2start = false;
let LVL3start = false;
const avatars = [];
const enemis = [];
const bonusArray = [];

app.use(express.static('client/public'));
const port = process.env.PORT == null ? 8000 : process.env.PORT;

httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

addWebpackMiddleware(app);

setInterval(function () {
	if (gameStarted) {
		t.addTime();
		io.emit('timer', t.getMin(), t.getSec());
	} else {
		t = new timer();
	}
}, 1000);

io.on('connection', socket => {
	cptConnexion++;
	if (cptConnexion <= 4) {
		firstAvatar = true;
		const avatar = new Avatar(`${socket.id}`, cptConnexion);
		io.emit('newAvatar', {
			id: cptConnexion,
			x: avatar.getX(),
			y: avatar.getY(),
		});
		avatars.push(avatar);

		socket.on('disconnect', () => {
			const disconnectedAvatarIndex = avatars.findIndex(
				avatar => avatar.nom === socket.id
			);
			if (disconnectedAvatarIndex !== -1) {
				io.emit('disconnectEvent', avatars[disconnectedAvatarIndex].id);
				avatars.splice(disconnectedAvatarIndex, 1);
			}
			console.log(`Client disconnected: ${socket.id}`);
		});

		socket.on('start', s => {
			if (s && cptConnexion !== 0) {
				gameStarted = s;
			} else if (cptConnexion === 0) {
				gameStarted = false;
			}
		});

		// Handling click events
		socket.on('clickEvent', clickEvent => {
			const playerAvatar = avatars.find(avatar => avatar.nom === clickEvent.id);
			if (playerAvatar) {
				playerAvatar.click[clickEvent.key] = clickEvent.pressed;
			} else {
				console.log(`No avatar found with the name ${clickEvent.id}`);
			}
		});

		socket.on('shoot', shoot => {
			const playerAvatar = avatars.find(avatar => avatar.nom === shoot.id);
			if (canShoot && playerAvatar) {
				playerAvatar.tirer();
				canShoot = false;
				setTimeout(() => {
					canShoot = true;
				}, 200);
			}
		});

		socket.on('canvasSize', canvasSize => {
			canvasSize = canvasSize;
		});
	}
});

const spawnIntervals = [
	{ delay: 1000, startCondition: () => gameStarted },
	{ delay: 800, startCondition: () => LVL2start && gameStarted },
	{ delay: 4000, startCondition: () => LVL3start && gameStarted },
];

spawnIntervals.forEach(({ delay, startCondition }, index) => {
	setInterval(() => {
		if (startCondition()) {
			let randomY =
				Math.random() * (canvasSize.height - (index === 0 ? 0 : 100));
			const newEnemy = new enemi(
				canvasSize.width - (index === 0 ? 0 : 100),
				randomY,
				index,
				index + 1
			);
			enemis.push(newEnemy);
		}
	}, delay);
});

setInterval(() => {
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
	updateGame();
}, 1000 / 60);

function updateGame() {
	io.emit('enemis', enemis);
	io.emit('bonusArray', bonusArray);

	const areAvatarsActive = avatars.some(avatar => !avatar.spectateur);

	if (firstAvatar && areAvatarsActive) {
		handleActiveAvatars();
	} else {
		endGame();
	}
}

function handleActiveAvatars() {
	const avatarData = [];
	avatars.forEach(avatar => {
		updateAvatar(avatar, avatarData);
	});
	io.emit('avatarsData', avatarData);
}

function updateAvatar(avatar, avatarData) {
	avatar.canvasSize = canvasSize;
	if (
		avatar.getStatut() === 'invincibilite' &&
		t.getTotalTime() - avatar.getStatutTime() === 15
	) {
		avatar.setStatut('null');
	}

	enemis.forEach(enemi => {
		handleAvatarEnemiCollisions(avatar, enemi);
	});

	avatar.deplacer();
	avatar.projectiles.forEach(projectile => projectile.deplacer());

	if (!avatar.spectateur) {
		avatarData.push({
			id: avatar.id,
			x: avatar.getX(),
			y: avatar.getY(),
			projectiles: avatar.projectiles,
			vies: avatar.getVies(),
			score: avatar.getScore(),
			socketId: avatar.nom,
		});
	}

	handleAvatarBonusCollisions(avatar);
}

function handleAvatarEnemiCollisions(avatar, enemi) {
	if (
		enemi.hitbox.colision(avatar.hitbox) &&
		avatar.getStatut() !== 'invincibilite'
	) {
		handleAvatarEnemiCollisionEffects(avatar, enemi);
	}

	if (enemi.getVies() < 0) {
		avatar.incrementScore(5);
		enemis.splice(enemis.indexOf(enemi), 1);
	}

	enemi.deplacer();

	avatar.projectiles.forEach(projectile => {
		if (projectile.hitbox.colision(enemi.hitbox)) {
			avatar.projectiles.splice(avatar.projectiles.indexOf(projectile), 1);
			handleProjectileEnemiCollisionEffects(avatar, enemi);
		}
	});
}

function handleAvatarEnemiCollisionEffects(avatar, enemi) {
	avatar.decrementScore(5);
	enemis.splice(enemis.indexOf(enemi), 1);
	avatar.perdreVie();

	if (canLostLifeAvatar) {
		canLostLifeAvatar = false;
		setTimeout(() => {
			canLostLifeAvatar = true;
		}, 100);
	}

	if (avatar.getVies() === 0) {
		avatar.setSpectateur();
		io.emit('dead', avatar.id);
	}
}

function handleProjectileEnemiCollisionEffects(enemi) {
	enemi.perdreVie();

	if (canLostLifeEnemi) {
		canLostLifeEnemi = false;
		setTimeout(() => {
			canLostLifeEnemi = true;
		}, 1000 / 60);
	}
}

function handleAvatarBonusCollisions(avatar) {
	bonusArray.forEach(bonus => {
		if (bonus.hitbox.colision(avatar.hitbox)) {
			handleBonusCollisionEffects(avatar, bonus);
		}

		if (bonus.estExpire(t.getTotalTime())) {
			bonusArray.splice(bonusArray.indexOf(bonus), 1);
		}
	});
}

function handleBonusCollisionEffects(avatar, bonus) {
	if (bonusNoms[bonus.getChoix()] === 'vie') {
		avatar.gagnerVie();
	} else if (bonusNoms[bonus.getChoix()] === 'invincibilite') {
		avatar.setStatut('invincibilite');
		avatar.setStatutTime(t.getTotalTime());
	}

	bonusArray.splice(bonusArray.indexOf(bonus), 1);
}

function endGame() {
	gameStarted = false;
	cptConnexion = 0;
	t = new timer();
	avatars.length = 0;
	io.emit('endGame', true);
}
