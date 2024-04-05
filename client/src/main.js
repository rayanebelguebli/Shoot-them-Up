import { Avatar } from './avatar.js';
import { io } from 'socket.io-client';
import draw from './draw.js';
import { bonusImages } from './utils.js';
import Render from './render.js';
import Afficher from './afficher.js';

const socket = io();
let min = 0;
let sec = 0;
let renderObject = new Render();

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const avatar = new Avatar('julien', 1);

renderObject.imageMortier.addEventListener('load', () => {
	avatar.setImageCanvas(renderObject.imageMortier, canvas);
	requestAnimationFrame(render);
});

renderObject.imageEnemi.addEventListener('load', () => {
	requestAnimationFrame(render);
});

setInterval(function () {
	socket.on('timer', (minute, seconde) => {
		min = minute;
		sec = seconde;
	});
}, 1000);

document.querySelector('.buttonStart').addEventListener('click', startGame);
document
	.querySelector('.credits')
	.addEventListener('click', Afficher.afficherCredits);

function startGame(event) {
	const canvasSize = Afficher.startGame(event, socket, canvas);
	socket.emit('canvasSize', canvasSize);
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

let newEnemis = [];
let newBonus = [];

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	renderObject.renderBackground(canvas);
	context.font = '40pt New Super Mario Font U';
	for (let i = 1; i < avatars.length; i++) {
		if (avatars[i] != undefined) {
			renderObject.renderScores(i, avatars[i], context);
			renderObject.renderVies(avatars, context, i);
		}
	}

	context.fillStyle = 'blue';

	context.fillText(0 + ':' + min + ':' + sec, canvas.width / 2, 50);

	for (let avatarId in avatars) {
		renderObject.renderProjectile(context, avatar, avatars, avatarId);
		for (let avatarId in avatars) {
			renderObject.renderProjectile(context, avatar, avatars, avatarId);
		}
		socket.on('bonusArray', data => {
			newBonus = data;
		});
		newBonus.forEach(bonus => {
			let img = new Image();
			img.src = bonusImages[bonus.choix];
			img.width = 75;
			img.height = 75;
			draw(canvas, context, img, bonus.x, bonus.y);
		});
		socket.on('enemis', data => {
			newEnemis = data;
		});
		newEnemis.forEach(enemi => {
			renderObject.renderEnnemi(canvas, context, enemi.x, enemi.y, enemi);
		});
		socket.on('bonusArray', data => {
			newBonus = data;
		});
		newBonus.forEach(bonus => {
			renderObject.renderBonus(
				canvas,
				context,
				bonusImages[bonus.choix],
				bonus.x,
				bonus.y
			);
		});
	}

	requestAnimationFrame(render);
}

let avatars = [];

socket.on('disconnectEvent', id => {
	avatars[id] = {};
});

socket.on('newAvatar', data => {
	avatars[data.id] = { x: data.x, y: data.y };
});

socket.on('avatarsData', avatarData => {
	avatarData.forEach(data => {
		if (avatars[data.id] != undefined) {
			avatars[data.id].x = data.x;
			avatars[data.id].y = data.y;
			avatars[data.id].projectiles = data.projectiles;
			avatars[data.id].vies = data.vies;
			avatars[data.id].score = data.score;
		} else {
			avatars[data.id] = {
				x: data.x,
				y: data.y,
				projectiles: data.projectiles,
				vies: data.vies,
				score: data.score,
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
