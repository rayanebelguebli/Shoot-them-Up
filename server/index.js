import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { Avatar } from '../common/avatar.js';
import enemi from './enemis.js';
import { Coordinate } from '../common/Coordinate.js';
import timer from './timer.js';
import Bonus from './bonus.js';
import { bonusNoms } from '../common/utils.js';
import { GestionScore } from './ScoreBoard.js';

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
		LVL2start = false;
		LVL3start = false;
	}
}, 1000);

const avatars = [];
const enemis = [];
const bonusArray = [];

let cptConnexion = 0;
let canShoot = true;
let LVL2start = false;
let LVL3start = false;
let firstAvatar = false;
const gestionScore = new GestionScore('client/public/res/scoreboard.json');
let scores = gestionScore.afficherScores();

io.on('connection', socket => {
	cptConnexion++;

	if (cptConnexion <= 4) {
		firstAvatar = true;

		const avatar = createAvatar(socket);

		io.emit('newAvatar', {
			id: cptConnexion,
			x: avatar.getX(),
			y: avatar.getY(),
		});

		handlePseudonym(socket, avatar);

		io.emit('scores', scores);

		handleDisconnect(socket);

		handleGameStart(socket);

		handleClickEvents(socket);

		handleShooting(socket);

		handleCanvasSize(socket);
	}
});

function createAvatar(socket) {
	const avatar = new Avatar(`${socket.id}`, cptConnexion);
	avatars.push(avatar);
	return avatar;
}

function handlePseudonym(socket, avatar) {
	socket.on('pseudo', pseudo => {
		avatar.pseudo = pseudo;
	});
}

function handleDisconnect(socket) {
	socket.on('disconnect', () => {
		avatars.forEach(avatar => {
			if (avatar.nom == socket.id) {
				io.emit('disconnectEvent', avatar.id);
				avatars.splice(avatars.indexOf(avatar), 1);
			}
		});
		console.log(`Déconnexion du client ${socket.id}`);
	});
}

function handleGameStart(socket) {
	socket.on('start', s => {
		if (s == true && cptConnexion != 0) {
			gameStarted = s;
		} else if (cptConnexion == 0) {
			gameStarted = false;
		}
	});
}

function handleClickEvents(socket) {
	socket.on('clickEvent', clickEvent => {
		const playerAvatar = avatars.find(avatar => avatar.nom === clickEvent.id);
		if (playerAvatar) {
			playerAvatar.click[clickEvent.key] = clickEvent.pressed;
		} else {
			console.log(`Aucun avatar trouvé avec le nom ${clickEvent.id}`);
		}
	});
}

function handleShooting(socket) {
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
}

function handleCanvasSize(socket) {
	socket.on('canvasSize', size => {
		console.log(size);
		canvasSize = size;
	});
}

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
		let randomY = Math.random() * (canvasSize.height - 100);
		const newEnemy = new enemi(canvasSize.width - 100, randomY, 1, 2);
		enemis.push(newEnemy);
	}
}, 800);

let spawnIntervalLV3 = setInterval(() => {
	if (LVL3start && gameStarted) {
		let randomY = Math.random() * (canvasSize.height - 100);
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
	updateScores();

	io.emit('enemis', enemis);

	io.emit('bonusArray', bonusArray);

	const areAvatarsActive = avatars.some(avatar => !avatar.spectateur);

	// Si des avatars sont actifs
	if (firstAvatar && areAvatarsActive) {
		const avatarData = [];

		avatars.forEach(avatar => {
			avatar.canvasSize = canvasSize;

			updateInvincibilityStatus(avatar);

			handleAvatarEnemyCollisions(avatar);

			moveEnemies();

			handleAvatarProjectileCollisions(avatar);

			moveAvatarsAndProjectiles(avatar);

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
		});

		io.emit('avatarsData', avatarData);
	} else {
		stopGame();
	}
}, 1000 / 60);

function updateScores() {
	scores = gestionScore.afficherScores();
	io.emit('scores', scores);
}

function updateInvincibilityStatus(avatar) {
	if (
		avatar.getStatut() == 'invincibilite' &&
		t.getTotalTime() - avatar.getStatutTime() == 15
	) {
		avatar.setStatut('null');
	}
}

function handleAvatarEnemyCollisions(avatar) {
	enemis.forEach(enemi => {
		if (
			enemi.hitbox.colision(avatar.hitbox) &&
			avatar.getStatut() != 'invincibilite' &&
			!avatar.spectateur
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
				gestionScore.ajouterScore(avatar.pseudo, avatar.score);
				avatar.setSpectateur();
				io.emit('dead', avatar.id);
			}
		}
	});
}

function moveEnemies() {
	enemis.forEach(enemi => {
		enemi.deplacer();
	});
}

function handleAvatarProjectileCollisions(avatar) {
	enemis.forEach(enemi => {
		avatar.projectiles.forEach(projectile => {
			if (projectile.hitbox.colision(enemi.hitbox)) {
				if (enemi.getVies() < 0) {
					avatar.incrementScore(5);
					enemis.splice(enemis.indexOf(enemi), 1);
				}
				avatar.projectiles.splice(avatar.projectiles.indexOf(projectile), 1);
				if (canLostLifeEnemi) {
					enemi.perdreVie();
					canLostLifeEnemi = false;
					setTimeout(function () {
						canLostLifeEnemi = true;
					}, 100);
				}
			}
		});
	});
}

function moveAvatarsAndProjectiles(avatar) {
	avatar.deplacer();
	avatar.projectiles.forEach(projectile => {
		projectile.deplacer();
	});
}

function handleAvatarBonusCollisions(avatar) {
	bonusArray.forEach(bonus => {
		if (bonus.hitbox.colision(avatar.hitbox)) {
			if (bonusNoms[bonus.getChoix()] == 'vie') {
				avatar.gagnerVie();
			} else if (
				bonusNoms[bonus.getChoix()] == 'invincibilite' ||
				!gameStarted
			) {
				avatar.setStatut('invincibilite');
				avatar.setStatutTime(t.getTotalTime());
			}
			bonusArray.splice(bonusArray.indexOf(bonus), 1);
		}
		if (bonus.estExpire(t.getTotalTime())) {
			bonusArray.splice(bonusArray.indexOf(bonus), 1);
		}
	});
}

function stopGame() {
	gameStarted = false;
	cptConnexion = 0;
	t = new timer();
	avatars.length = 0;
	io.emit('endGame', true);
}
