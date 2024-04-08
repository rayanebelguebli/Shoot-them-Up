import { Hitbox } from './hitbox.js';
import draw from '../client/src/draw.js';
import Entite from './entite.js';

export class Projectile extends Entite {
	vitesse;

	constructor(x, y, image) {
		super(x, y, new Hitbox(122 / 2, 68, x, y), image);
		this.vitesse = 10;
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
