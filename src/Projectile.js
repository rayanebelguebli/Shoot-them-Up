export class Projectile {
	x;
	y;
	vitesse;

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vitesse = 5;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	deplacer() {
		this.x += this.vitesse;
	}

	dessiner(context, image) {
		context.drawImage(image, this.x, this.y);
	}
}
