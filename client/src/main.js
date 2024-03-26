import { Avatar } from './avatar.js';
import Enemi from './enemis.js';
import { io } from 'socket.io-client';
import timer from './timer.js';
import setHtml from './setHtml.js';
import draw from './draw.js';

const socket = io();
let t = new timer();

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const enemis = [];
const avatar = new Avatar('julien', 1);
const imageMortier = new Image();
const imageProjectile = new Image();
const imageEnemi = new Image();
const background = new Image();
const imageCoeur = new Image();

imageMortier.src = '/images/mortier.png';
imageProjectile.src = '/images/bill.png';
imageEnemi.src = '/images/koopa.png';
background.src = '/images/background.webp';
imageCoeur.src = '/images/heart.webp';
let gameStarted = false;

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
		console.log(t.getSec());
	}
}, 1000);

document.querySelector('.buttonStart').addEventListener('click', startGame);
document.querySelector('.credits').addEventListener('click', afficherCredits);

function afficherCredits(event) {
	event.preventDefault();
	document.querySelector('.divMenu').innerHTML = setHtml.vide();
	document.querySelector('.divFinDePartie').innerHTML = setHtml.vide();
	document.querySelector('.divCredits').innerHTML = setHtml.credits();
	const retour = document.querySelector('.retourMenu');
	retour.addEventListener('click', afficherMenu);
}

function afficherMenu(event) {
	event.preventDefault();
	document.querySelector('.divMenu').innerHTML = setHtml.menu();
	document.querySelector('.divFinDePartie').innerHTML = setHtml.vide();
	document.querySelector('.divCredits').innerHTML = setHtml.vide();
	document.querySelector('.buttonStart').addEventListener('click', startGame);
	document.querySelector('.credits').addEventListener('click', afficherCredits);
}

function afficherFinDePartie() {
	gameStarted = false;
	canvas.style.display = 'none';
	document.querySelector('.divMenu').innerHTML = setHtml.vide();
	document.querySelector('.divCredits').innerHTML = setHtml.vide();
	document.querySelector('.divFinDePartie').innerHTML = setHtml.finDePartie(
		avatar,
		t
	);
	document.querySelector('.divCredits').innerHTML = setHtml.vide();
	const retour = document.querySelector('.retourMenu');
	retour.addEventListener('click', afficherMenu);
}

function startGame(event) {
	gameStarted = true;
	event.preventDefault();
	const buttons = document.querySelectorAll('button');
	const title = document.querySelector('h1');
	canvas.style.display = '';
	buttons.forEach(button => (button.style.display = 'none'));
	title.style.display = 'none';
}

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let canshoot = true;

document.addEventListener('keydown', event => {
	avatar.changerClick(event);
	if (event.key === ' ') {
		if (canshoot) {
			avatar.tirer();
			canshoot = false;
			setTimeout(function () {
				canshoot = true;
			}, 500);
		}
	}
});

document.addEventListener('keyup', event => {
	avatar.changerClick(event);
});

setInterval(() => {
	avatar.deplacer();
	avatar.projectiles.forEach(projectile => projectile.deplacer());
	enemis.forEach(enemi => {
		if (enemi.hitbox.colision(avatar.hitbox)) {
			avatar.decrementScore(5);
			enemis.splice(enemis.indexOf(enemi), 1);
			avatar.perdreVie();
			if (avatar.getVies() == 0) {
				afficherFinDePartie();
				avatar.initAvatar();
				t = new timer();
			}
		}
		enemi.deplacer();
		avatar.colision(enemi.hitbox);
		avatar.projectiles.forEach((projectile, index) => {
			if (projectile.hitbox.colision(enemi.hitbox)) {
				enemis.splice(enemis.indexOf(enemi), 1);
				avatar.incrementScore(5);
			}
		});
	});
}, 1000 / 60);

let spawnInterval = setInterval(() => {
	if (gameStarted) {
		const randomY = Math.random() * (canvas.height - 0) + 0;
		const newEnemy = new Enemi(
			canvas.width - imageEnemi.width,
			randomY,
			imageEnemi
		);
		enemis.push(newEnemy);
	}
}, 1500);

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height);
	avatar.dessinerProjectiles(canvas, context, imageProjectile);
	context.drawImage(avatar.image, avatar.getX(), avatar.getY());
	if (t.getSec() >= 15) {
		enemis.forEach(enemi => {
			enemi.setVx(10);
			enemi.setVy(4);
		});
	}
	enemis.forEach(enemi => {
		console.log(enemi.getVies());
		if (
			enemi.x <= canvas.width - enemi.image.width &&
			enemi.y <= canvas.height &&
			enemi.x >= 0 &&
			enemi.y >= 0 &&
			enemi.getVies() > 0
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

	requestAnimationFrame(render);
}

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});
});
