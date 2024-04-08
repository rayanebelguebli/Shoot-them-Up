import { Avatar } from '../../common/avatar.js';
import { io } from 'socket.io-client';
import draw from './draw.js';
import { bonusImages } from '../../common/utils.js';
import Render from './render.js';
import Afficher from './afficher.js';
import setHtml from './setHtml.js';

const socket = io();
let min = 0;
let sec = 0;
let renderObject = new Render();
const affichage = new Afficher();
let gameStarted = false;

let clientScores = '';

socket.on('scores', scores => {
	clientScores = scores;
});

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const avatar = new Avatar('1', 1);

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

setInterval(() => {
	socket.emit('start', gameStarted);
}, 1000 / 16);

document.querySelector('.buttonStart').addEventListener('click', startGame);
document
	.querySelector('.credits')
	.addEventListener('click', affichage.afficherCredits);

function startGame(event) {
	const canvasSize = affichage.startGame(event, canvas);
	socket.emit('canvasSize', canvasSize);
}

document.querySelector('.buttonStart').addEventListener('click', inputPseudo);

function inputPseudo(event) {
	const pseudo = prompt('Veuillez saisir votre pseudo :');

	if (pseudo !== null && pseudo.trim() !== '') {
		socket.emit('pseudo', pseudo);

		const canvasSize = affichage.startGame(event, canvas);
		socket.emit('canvasSize', canvasSize);
	} else {
		alert('Veuillez saisir un pseudo valide');
	}
}

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let newEnemis = [];
let newBonus = [];

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	renderObject.renderBackground(canvas);
	gameStarted = affichage.isGameStarted();
	socket.on('enemis', data => {
		newEnemis = data;
	});
	socket.on('bonusArray', data => {
		newBonus = data;
	});

	if (gameStarted) {
		context.font = '40pt New Super Mario Font U';
		context.fillStyle = 'blue';
		context.fillText(`0:${min}:${sec}`, canvas.width / 2, 50);

		Object.entries(avatars)
			.filter(([avatarId, avatarData]) => avatarData !== undefined)
			.forEach(([avatarId, avatarData]) => {
				renderObject.renderScores(avatarId, avatarData, context);
				renderObject.renderVies(avatars, context, avatarId);
			});

		renderProjectiles();
		renderBonuses();
		renderEnemies();
	}

	requestAnimationFrame(render);
}

function renderProjectiles() {
	for (const avatarId in avatars) {
		renderObject.renderProjectile(context, avatar, avatars, avatarId);
	}
}

function renderBonuses() {
	newBonus.forEach(bonus => {
		const img = new Image();
		img.src = bonusImages[bonus.choix];
		img.width = 75;
		img.height = 75;
		draw(canvas, context, img, bonus.x, bonus.y);
	});
}

function renderEnemies() {
	newEnemis.forEach(enemi => {
		renderObject.renderEnnemi(canvas, context, enemi.x, enemi.y, enemi);
	});
}

let avatars = [];

let avatarsScore = {};

socket.on('dead', avatarId => {
	const score = avatars[avatarId] ? avatars[avatarId].score : 0;

	avatarsScore[avatarId] = score;

	delete avatars[avatarId];
});

socket.on('avatarsData', avatarData => {
	for (const data of avatarData) {
		avatars[data.id] = {
			x: data.x,
			y: data.y,
			projectiles: data.projectiles,
			vies: data.vies,
			score: data.score,
			socketId: data.socketId,
		};
	}
});

const keysPressed = {};

document.addEventListener('keydown', handleKeyEvent);
document.addEventListener('keyup', handleKeyEvent);

function handleKeyEvent(event) {
	keysPressed[event.keyCode] = event.type === 'keydown';

	if (event.key === ' ' && gameStarted) {
		socket.emit('shoot', {
			id: `${socket.id}`,
			shoot: true,
		});
	}

	socket.emit('clickEvent', {
		id: `${socket.id}`,
		key: event.keyCode,
		pressed: event.type === 'keydown',
	});

	event.preventDefault();
}

socket.once('endGame', () => {
	affichage.afficherFinDePartie(
		canvas,
		avatarsScore[1],
		avatarsScore[2],
		avatarsScore[3],
		avatarsScore[4]
	);
});
document
	.querySelector('.scoreBoard')
	.addEventListener('click', () => affichage.afficherScores(clientScores));
