export class Hitbox {
	width;
	height;
	x;
	y;

	constructor(width, height, x, y) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}

	colision(hitbox) {
		return (
			this.x < hitbox.x + hitbox.width &&
			this.x + this.width > hitbox.x &&
			this.y < hitbox.y + hitbox.height &&
			this.height + this.y > hitbox.y
		);
	}
}
