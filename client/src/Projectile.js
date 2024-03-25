import { Hitbox } from './hitbox.js';
import draw from './draw.js';

export class Projectile {
	x;
	y;
	vitesse;
	hitbox;

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vitesse = 5;
		this.hitbox = new Hitbox(122, 68, this.x, this.y);
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

	dessiner(canvas, context, image) {
		return draw(canvas, context, image, this.x, this.y);
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
