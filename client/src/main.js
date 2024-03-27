import { Avatar } from './avatar.js';
import Enemi from './enemis.js';
import { io } from 'socket.io-client';
import timer from './timer.js';
import setHtml from './setHtml.js';
import draw from './draw.js';
import { Coordinate } from './Coordinate.js';

const socket = io();
let t = new timer();

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const enemis = [];
const avatar = new Avatar('julien', 1);
const imageMortier = new Image();
const imageProjectile = new Image();
const imageEnemi = new Image();
const imageEnemi2 = new Image();
const background = new Image();
const imageCoeur = new Image();

imageMortier.src = '/images/mortier.png';
imageProjectile.src = '/images/bill.png';
imageEnemi.src = '/images/koopa.png';
imageEnemi2.src = '/images/bob_omb.png';
background.src = '/images/background2.webp';
imageCoeur.src = '/images/heart.webp';
let gameStarted = false;
let LV2Started = false;
let canLostLifeAvatar = true;
let canLostLifeEnemi = true;

const canvasSize = new Coordinate(canvas.width, canvas.height);
socket.emit('canvasSize', canvasSize);

imageMortier.addEventListener('load', () => {
	avatar.setImageCanvas(imageMortier, canvas);
	requestAnimationFrame(render);
});

imageEnemi.addEventListener('load', () => {
	requestAnimationFrame(render);
});

setInterval(function () {
	if (gameStarted) {
		t.addTime();
	}
}, 1000);

document.querySelector('.buttonStart').addEventListener('click', startGame);
document.querySelector('.credits').addEventListener('click', afficherCredits);

function afficherCredits(event) {
	event.preventDefault();
	document.querySelector('.divMain').innerHTML = setHtml.credits();
	const retour = document.querySelector('.retourMenu');
	retour.addEventListener('click', afficherMenu);
}

function afficherMenu(event) {
	event.preventDefault();
	document.querySelector('.divMain').innerHTML = setHtml.menu();
	document.querySelector('.buttonStart').addEventListener('click', startGame);
	document.querySelector('.credits').addEventListener('click', afficherCredits);
}

function afficherFinDePartie() {
	gameStarted = false;
	canvas.style.display = 'none';
	document.querySelector('.divMain').innerHTML = setHtml.finDePartie(avatar, t);
	const retour = document.querySelector('.retourMenu');
	retour.addEventListener('click', afficherMenu);
}

function startGame(event) {
	gameStarted = true;
	event.preventDefault();
	canvas.style.display = '';
	document.querySelector('.divMain').innerHTML = setHtml.vide();
}

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

document.addEventListener('keydown', event => {
	let canShoot = true;
	avatar.changerClick(event);
	if (event.key === ' ') {
		if (canShoot) {
			avatar.tirer();
			canShoot = false;
			setTimeout(function () {
				canShoot = true;
			}, 100);
		}
	}
});

document.addEventListener('keyup', event => {
	avatar.changerClick(event);
});

setInterval(() => {
	/*avatar.deplacer();
	avatar.projectiles.forEach(projectile => projectile.deplacer());
	enemis.forEach(enemi => {
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
				afficherFinDePartie();
				avatar.initAvatar();
				t = new timer();
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
	});*/
}, 1000 / 60);

/*
let spawnIntervalLV1 = setInterval(() => {
	if (gameStarted) {
		let randomY = Math.random() * (canvas.height - 0) + 0;
		do {
			randomY = Math.random() * (canvas.height - 0) + 0;
		} while (randomY > canvas.height - imageEnemi.height);
		const newEnemy = new Enemi(
			canvas.width - imageEnemi.width,
			randomY,
			imageEnemi,
			1
		);
		enemis.push(newEnemy);
	}
}, 1000);

let spawnIntervalLV2 = setInterval(() => {
	if (gameStarted && LV2Started) {
		let randomY = Math.random() * (canvas.height - 0) + 0;
		do {
			randomY = Math.random() * (canvas.height - 0) + 0;
		} while (randomY > canvas.height - imageEnemi2.height);
		const newEnemy = new Enemi(
			canvas.width - imageEnemi2.width,
			randomY,
			imageEnemi2,
			2
		);
		enemis.push(newEnemy);
	}
}, 800);*/

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height);
	//avatar.dessinerProjectiles(canvas, context);
	//context.drawImage(avatar.image, avatar.getX(), avatar.getY());
	if (t.getSec() >= 10) {
		LV2Started = true;
		enemis.forEach(enemi => {
			enemi.setVx(10);
			enemi.setVy(4);
		});
	}
	enemis.forEach(enemi => {
		console.log(enemi.getDifficulte());
		if (
			enemi.x <= canvas.width - enemi.image.width &&
			enemi.y <= canvas.height &&
			enemi.x >= 0 &&
			enemi.y >= 0
		) {
			draw(canvas, context, enemi.image, enemi.x, enemi.y);
		} else {
			enemis.splice(enemis.indexOf(enemi), 1);
		}
	});
	context.font = '40pt New Super Mario Font U';
	context.fillStyle = 'blue';
	context.fillText(avatar.getScore(), 10, 50);
	context.fillText(
		t.getHrs() + ':' + t.getMin() + ':' + t.getSec(),
		canvas.width / 2,
		50
	);

	for (let i = 0; i < avatar.getVies(); i++) {
		context.drawImage(imageCoeur, canvas.width - (3 - i) * 50, 0, 50, 50);
	}

	for (let avatarId in avatars) {
		context.drawImage(avatar.image, avatars[avatarId].x, avatars[avatarId].y);
		if (avatars[avatarId].projectiles != undefined) {
			avatars[avatarId].projectiles.forEach(projectile => {
				context.drawImage(imageProjectile, projectile.x, projectile.y);
			});
		}
	}

	requestAnimationFrame(render);
}

let avatars = [];

socket.on('newAvatar', data => {
	avatars[data.id] = { x: data.x, y: data.y };
	console.log(avatars[data.id]);
});

socket.on('avatarsData', avatarData => {
	avatarData.forEach(data => {
		if (avatars[data.id] != undefined) {
			avatars[data.id].x = data.x;
			avatars[data.id].y = data.y;
			avatars[data.id].projectiles = data.projectiles;
		} else {
			avatars[data.id] = {
				x: data.x,
				y: data.y,
				projectiles: data.projectiles,
			};
		}
	});
});
const keysPressed = {};

document.addEventListener('keydown', event => {
	keysPressed[event.keyCode] = true;
	if (event.key === ' ') {
		socket.emit('shoot', {
			id: `${socket.id}`,
			shoot: true,
		});
	}
	socket.emit('clickEvent', {
		id: `${socket.id}`,
		key: event.keyCode,
		pressed: true,
	});
	event.preventDefault();
});

document.addEventListener('keyup', event => {
	keysPressed[event.keyCode] = false;

	socket.emit('clickEvent', {
		id: `${socket.id}`,
		key: event.keyCode,
		pressed: false,
	});

	event.preventDefault();
});

function isKeyPressed(keyCode) {
	return !!keysPressed[keyCode];
}
