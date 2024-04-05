import { Avatar } from './avatar.js';
import { io } from 'socket.io-client';
import setHtml from './setHtml.js';
import draw from './draw.js';
import { Coordinate } from './Coordinate.js';
import { bonusImages, colors } from './utils.js';
import Render from './render.js';

const socket = io();
let min = 0;
let sec = 0;

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const avatar = new Avatar('julien', 1);
const imageMortier = new Image();
const imageProjectile = new Image();
const imageEnemi = new Image();
const imageEnemi2 = new Image();
const imageEnemi3 = new Image();
const background = new Image();
const imageCoeur = new Image();

imageMortier.src = '/images/mortier.png';
imageProjectile.src = '/images/bill.png';
imageEnemi.src = '/images/koopa.png';
imageEnemi2.src = '/images/bob_omb.png';
imageEnemi3.src = '/images/boo.png';
background.src = '/images/background2.webp';
imageCoeur.src = '/images/heart1.webp';
let gameStarted = false;

imageMortier.addEventListener('load', () => {
	avatar.setImageCanvas(imageMortier, canvas);
	requestAnimationFrame(render);
});

imageEnemi.addEventListener('load', () => {
	requestAnimationFrame(render);
});

setInterval(function () {
	socket.on('timer', (minute, seconde) => {
		min = minute;
		sec = seconde;
	});
}, 1000);

document.querySelector('.buttonStart').addEventListener('click', startGame);
document.querySelector('.credits').addEventListener('click', afficherCredits);

/*document
	.querySelector('.scoreBoard')
	.addEventListener('click', afficherScoreboard);

let scoreBoard = '';
fetch('./scoreboard.json')
	.then(response => {
		if (!response.ok) {
			throw new Error('Erreur lors de la récupération du fichier JSON');
		}
		return response.json();
	})
	.then(data => {
		const score = data.results;
		score.forEach(element => {
			scoreBoard += 'Nom: ' + element.nom;
			scoreBoard += ' Score: ' + element.score;
			scoreBoard += '</br></br>';
		});
	})
	.catch(error => {
		scoreBoard += error.message;
	});

function afficherScoreboard(event) {
	event.preventDefault();
	document.querySelector('.divMain').innerHTML = scoreBoard;
	const retour = document.querySelector('.retourMenu');
	retour.addEventListener('click', afficherMenu);
}*/

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
	document.querySelector('.animation').style.display = '';
	document.querySelector('.divMain').innerHTML = setHtml.finDePartie(avatar, t);
	document.querySelector('.retourMenu').addEventListener('click', afficherMenu);
}

function startGame(event) {
	gameStarted = true;
	socket.emit('start', gameStarted);
	event.preventDefault();
	canvas.style.display = '';
	document.querySelector('.divMain').innerHTML = setHtml.vide();
	document.querySelector('.animation').style.display = 'none';
	const canvasSize = new Coordinate(canvas.clientWidth, canvas.clientHeight);
	socket.emit('canvasSize', canvasSize);
}

setInterval(() => {
	socket.emit('start', gameStarted);
}, 1000 / 16);

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
	context.drawImage(background, 0, 0, canvas.width, canvas.height);
	if (gameStarted) {
		context.font = '40pt New Super Mario Font U';
		for (let i = 1; i < avatars.length; i++) {
			if (avatars[i] != undefined) {
				context.fillStyle = colors[i - 1];
				const x = 10 + i * 100;
				if (avatars[i].score != undefined) {
					context.fillText(avatars[i].score, x, 50);
				}
				imageCoeur.src = `/images/heart${i}.webp`;
				console.log(imageCoeur.src);
				for (let j = 0; j < avatars[i].vies; j++) {
					context.drawImage(
						imageCoeur,
						avatars[i].x + (avatars[i].vies - j) * 20 - 15,
						avatars[i].y + imageMortier.height,
						20,
						20
					);
				}
			}
		}

		context.fillStyle = 'blue';

		context.fillText(0 + ':' + min + ':' + sec, canvas.width / 2, 50);

		for (let avatarId in avatars) {
			Render.renderProjectile(
				context,
				avatar,
				avatars,
				avatarId,
				imageProjectile
			);
			for (let avatarId in avatars) {
				Render.renderProjectile(
					context,
					avatar,
					avatars,
					avatarId,
					imageProjectile
				);
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
				Render.renderEnnemi(
					canvas,
					context,
					imageEnemi,
					imageEnemi2,
					imageEnemi3,
					enemi.x,
					enemi.y,
					enemi
				);
			});
			socket.on('bonusArray', data => {
				newBonus = data;
			});
			newBonus.forEach(bonus => {
				Render.renderBonus(
					canvas,
					context,
					bonusImages[bonus.choix],
					bonus.x,
					bonus.y
				);
			});
		}
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
