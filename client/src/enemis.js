export default class enemi {
	y;
	x;
	type;
	vies;

	constructor(type, x, y) {
		this.type = type;
		this.y = y;
		this.x = x;
		if (type == 'simple') {
			this.vies = 3;
		} else {
			this.vie = 0;
		}
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

	getType() {
		return this.type;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	deplacer() {
		this.x--;
	}
}
