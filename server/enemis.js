import Entite from './entite.js';
import { Hitbox } from './hitbox.js';
export default class enemi extends Entite {
	vy;
	vx;
	vies;
	amplitude;
	direction;
	positionInitialeY;
	difficulté;

	constructor(x, y, image, difficulté) {
		super(x, y, new Hitbox(50 / 3, 66 / 2, x, y), image);
		if (difficulté == 1) {
			this.vx = 3;
			this.vy = 0;
			this.hitbox = new Hitbox(69 / 3, 57 / 2, this.x, this.y);
		} else if (difficulté == 2) {
			this.vx = 5;
			this.vy = 1;
		} else if (difficulté == 3) {
			this.vx = 20;
			this.vy = 16;
		}
		this.difficulté = difficulté;
		this.vies = 2;
		this.amplitude = 20;
		this.direction = 1;
		this.positionInitialeY = y;
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
