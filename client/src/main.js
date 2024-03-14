import { Avatar } from './avatar.js';
import Enemi from './enemis.js';
import { io } from 'socket.io-client';
import timer from './timer.js';

const socket = io();
let t = new timer();

const startButton = document.querySelector('.buttonStart');
const creditsButton = document.querySelector('.credits');
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const enemis = [];
const avatar = new Avatar('julien', 5);
const imageMortier = new Image();
const imageProjectile = new Image();
const imageEnemi = new Image();
const background = new Image();
let spawnInterval = 3000;

imageMortier.src = '/images/mortier.png';
imageProjectile.src = '/images/bill.png';
imageEnemi.src = '/images/koopa.png';
background.src = '/images/background.webp';

imageMortier.addEventListener('load', () => {
	avatar.setImageCanvas(imageMortier, canvas);
	requestAnimationFrame(render);
});

imageEnemi.addEventListener('load', () => {
	requestAnimationFrame(render);
});

setInterval(function () {
	t.addTime();
	console.log(t.getSec());
}, 1000);

startButton.addEventListener('click', startGame);
creditsButton.addEventListener('click', afficherCredits, 50);

function afficherCredits(event) {
	event.preventDefault();
	const buttons = document.querySelectorAll('button');
	const title = document.querySelector('h1');
	buttons.forEach(button => (button.style.display = 'none'));
	title.style.display = 'none';
	const credits = document.querySelector('.divCredits');
	credits.style.display = '';
	const retour = document.querySelector('.retourMenu');
	retour.style.display = '';
	retour.addEventListener('click', afficherMenu);
}

function afficherMenu(event) {
	event.preventDefault();
	const buttons = document.querySelectorAll('button');
	const title = document.querySelector('h1');
	buttons.forEach(button => (button.style.display = ''));
	title.style.display = '';
	const credits = document.querySelector('.divCredits');
	credits.style.display = 'none';
	canvas.style.display = 'none';
}

function startGame(event) {
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
		enemi.x -= 8;
		avatar.colision(enemi.x, enemi.y, imageEnemi);
		avatar.projectiles.forEach((projectile, index) => {
			if (projectile.colision(enemi.x, enemi.y, imageEnemi)) {
				enemis.splice(enemis.indexOf(enemi), 1);
				avatar.incrementScore(5);
			}
		});
	});
}, 1000 / 60);

setInterval(() => {
	const randomY = Math.random() * (canvas.height - 0) + 0;
	const newEnemy = new Enemi('simple', 2000, randomY);
	enemis.push(newEnemy);
}, spawnInterval);

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	avatar.dessinerProjectiles(context, imageProjectile);
	context.drawImage(avatar.image, avatar.getX(), avatar.getY());

	enemis.forEach(enemi => {
		context.drawImage(imageEnemi, enemi.x, enemi.y);
	});
	context.font = '40pt New Super Mario Font U';
	context.fillStyle = 'blue';
	context.fillText(avatar.getScore(), 10, 50);
	console.log(avatar.getScore());

	context.font = '40pt New Super Mario Font U';
	context.fillStyle = 'blue';
	context.fillText(
		t.getHrs() + ':' + t.getMin() + ':' + t.getSec(),
		canvas.width / 2,
		50
	);

	requestAnimationFrame(render);
}

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});
});
