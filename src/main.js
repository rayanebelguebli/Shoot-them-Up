import { Avatar } from './avatar.js';
import enemi from './enemis.js';

const start = document.querySelector('.buttonStart');
const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

const e1 = new enemi('simple', 2000, 100);
const e2 = new enemi('simple', 2000, 100);

const data = [
	{
		x: e1.x,
		y: e1.y,
	},
	{
		x: e2.x,
		y: e2.y,
	},
];

function startGame(event) {
	event.preventDefault();
	const button = document.querySelectorAll('button');
	const title = document.querySelector('h1');
	canvas.setAttribute('style', '');
	button.forEach(e => e.setAttribute('style', 'display : none'));
	title.setAttribute('style', 'display : none');
}
start.addEventListener('click', startGame);

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

const enemiSimple = new Image();
enemiSimple.src = '/images/koopa.png';
enemiSimple.addEventListener('load', event => {
	data.forEach(e => {
		context.drawImage(enemiSimple, e.x, e.y);
		requestAnimationFrame(render);
	});
});

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.drawImage(enemiSimple, e1.x, e1.y);

	avatar.dessinerProjectiles(context, imageProjectile);

	context.drawImage(avatar.image, avatar.getX(), avatar.getY());

	enemis.forEach(enemi => {
		//console.log(enemi.x);
		context.drawImage(enemiSimple, enemi.x, enemi.y);
	});

	requestAnimationFrame(render);
}

const avatar = new Avatar('julien', 5);

const image = new Image();
image.src = '/images/mortier.png';
image.addEventListener('load', event => {
	context.drawImage(image, 0, 0);
	requestAnimationFrame(renderImage);
});
avatar.setImageCanvas(image, canvas);

function renderImage() {
	context.clearRect(0, 0, 10, 10);
	context.drawImage(image, avatar.getX(), avatar.getY());
	requestAnimationFrame(renderImage);
}

const imageProjectile = new Image();
imageProjectile.src = '/images/bill.png';

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
	e1.x = e1.x - 10;
	enemis.forEach(enemi => {
		enemi.x -= 10;
	});
}, 1000 / 60);

let enemis = [];

setInterval(() => {
	let alea = Math.random() * (canvas.height - 0) + 0;
	const newEnemy = new enemi('simple', 2000, alea);
	enemis.push(newEnemy);
	console.log('enemi ajouté');
}, 3000);
