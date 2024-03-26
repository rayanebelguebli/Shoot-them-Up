import { Hitbox } from './hitbox.js';
export default class enemi {
	y;
	x;
	vy;
	vx;
	vies;
	hitbox;
	image;
	amplitude;
	direction;
	positionInitialeY;
	difficulté;

	constructor(x, y, image, difficulté) {
		this.y = y;
		this.x = x;
		this.vx = 8;
		this.vy = 0;
		this.image = image;
		this.vies = 2;
		this.amplitude = 20;
		this.direction = 1;
		this.positionInitialeY = y;
		this.difficulté = difficulté;
		this.hitbox = new Hitbox(image.width, image.height, this.x, this.y);
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

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getDifficulte() {
		return this.difficulté;
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
