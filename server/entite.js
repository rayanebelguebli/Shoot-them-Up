export default class Entite {
	y;
	x;
	hitbox;
	image;

	constructor(x, y, hitbox, image) {
		this.x = x;
		this.y = y;
		this.hitbox = hitbox;
		this.image = image;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getImage() {
		return this.image;
	}

	getHitbox() {
		return this.hitbox;
	}
}
