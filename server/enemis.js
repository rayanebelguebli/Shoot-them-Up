import Entite from '../client/src/entite.js';
import { Hitbox } from '../client/src/hitbox.js';
export default class enemi extends Entite {
	vy;
	vx;
	vies;
	amplitude;
	direction;
	positionInitialeY;
	difficulté;

	constructor(x, y, image, difficulté) {
		super(x, y, new Hitbox(50 / 2, 66, x, y), image);
		if (difficulté == 1) {
			this.hitbox = new Hitbox(69 / 2, 57, this.x, this.y);
		}
		this.difficulté = difficulté;
		this.vx = 3;
		this.vy = 0;
		this.vies = 2;
		this.amplitude = 20;
		this.direction = 1;
		this.positionInitialeY = y;
	}

	colision(x, y, image) {
		return (
			x >= this.x &&
			x <= this.x + image.width &&
			y >= this.y &&
			y <= this.y + image.height
		);
	}

	getVies() {
		return this.vies;
	}

	getDifficulte() {
		return this.difficulté;
	}

	getVx() {
		return this.vx;
	}

	getVy() {
		return this.vy;
	}

	setVx(vx) {
		this.vx = vx;
	}

	setVy(vy) {
		this.vy = vy;
	}

	deplacer() {
		this.x -= this.vx;
		this.hitbox.x = this.x;
		if (this.getDifficulte() > 1) {
			this.y += this.vy * this.direction;
			if (this.y < this.positionInitialeY - this.amplitude) {
				this.direction = 1;
			} else if (this.y > this.positionInitialeY + this.amplitude) {
				this.direction = -1;
			}
		}
	}

	perdreVie() {
		this.vies--;
	}
}
