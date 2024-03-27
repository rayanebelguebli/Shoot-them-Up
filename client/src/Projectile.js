import { Hitbox } from './hitbox.js';
import draw from './draw.js';

export class Projectile {
	x;
	y;
	vitesse;
	image;
	hitbox;

	constructor(x, y, image) {
		this.x = x;
		this.y = y;
		this.vitesse = 5;
		this.image = image;
		this.hitbox = new Hitbox(image.width / 2, image.height, this.x, this.y);
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	deplacer() {
		this.x += this.vitesse;
		this.hitbox.x += this.vitesse;
	}

	dessiner(canvas, context) {
		return draw(canvas, context, this.image, this.x, this.y);
	}

	colision(x, y, image) {
		return (
			x >= this.x &&
			x <= this.x + image.width &&
			y >= this.y &&
			y <= this.y + image.height
		);
	}
}
