import { Avatar } from './avatar.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');
context.moveTo(0, 0);

const image = new Image();
image.src = '/images/monster.png';
let avatar = new Avatar('nom', 3);
avatar.setImageCanvas(image, canvas);

function render() {
	context.save();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();
	context.stroke();
	context.drawImage(image, avatar.getX(), avatar.getY());
}

document.addEventListener('keydown', event => {
	avatar.changerClick(event);
	render();
});

document.addEventListener('keyup', event => {
	avatar.changerClick(event);
});

// setInterval(avatar.deplacer, 1000 / 60);
image.addEventListener('load', event => {
	render();
});
