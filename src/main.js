import { Avatar } from './avatar.js';
import Enemi from './enemis.js';

const startButton = document.querySelector('.buttonStart');
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
const enemis = [];

const avatar = new Avatar('julien', 5);
const imageMortier = new Image();
const imageProjectile = new Image();
const imageEnemi = new Image();

imageMortier.src = '/images/mortier.png';
imageProjectile.src = '/images/bill.png';
imageEnemi.src = '/images/koopa.png';

imageMortier.addEventListener('load', () => {
	avatar.setImageCanvas(imageMortier, canvas);
	requestAnimationFrame(render);
});

imageEnemi.addEventListener('load', () => {
	requestAnimationFrame(render);
});

startButton.addEventListener('click', startGame);

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

document.addEventListener('keydown', event => {
	avatar.changerClick(event);
	if (event.key === ' ') {
		avatar.tirer();
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
			}
		});
	});
}, 1000 / 60);

setInterval(() => {
	const randomY = Math.random() * (canvas.height - 0) + 0;
	const newEnemy = new Enemi('simple', 2000, randomY);
	enemis.push(newEnemy);
}, 3000);

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	avatar.dessinerProjectiles(context, imageProjectile);
	context.drawImage(avatar.image, avatar.getX(), avatar.getY());

	enemis.forEach(enemi => {
		context.drawImage(imageEnemi, enemi.x, enemi.y);
	});

	requestAnimationFrame(render);
}
