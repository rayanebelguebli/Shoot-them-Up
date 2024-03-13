import { Projectile } from './Projectile.js';

export class Avatar {
	y;
	x;
	nom;
	vies;
	click;
	vitesse;
	image;
	canvas;
	projectiles;
	score;

	constructor(nom, vitesse) {
		this.nom = nom;
		this.y = 0;
		this.x = 0;
		this.vies = 3;
		this.click = null;
		this.vitesse = vitesse;
		this.projectiles = [];
	}

	incrementScore(nb) {
		this.score += nb;
	}

	tirer() {
		let projectile = new Projectile(this.x, this.y);
		this.projectiles.push(projectile);
	}

	dessinerProjectiles(context, imageProjectile) {
		this.projectiles.forEach(projectile => {
			projectile.dessiner(context, imageProjectile);
			projectile.deplacer();
		});
	}

	setImageCanvas(image, canvas) {
		this.image = image;
		this.canvas = canvas;
	}

	getVies() {
		return this.vies;
	}

	getScore() {
		return this.score;
	}

	getNom() {
		return this.nom;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getClick() {
		return this.click;
	}

	colision(x, y, image) {
		this.projectiles.forEach(element => {
			if (element.colision(x, y, image)) {
				console.log('colision');
			} else {
				console.log('pas colison');
			}
		});
	}

	changerClick(event) {
		if (event.type == 'keydown') {
			this.click = event.key;
		} else if (event.type == 'keyup') {
			this.click = null;
		}
	}

	deplacer() {
		if (this.click == 'ArrowLeft') {
			if (this.x > 0) {
				this.x -= this.vitesse;
			}
		} else if (this.click == 'ArrowRight') {
			if (this.x < this.canvas.width - this.image.width) {
				this.x += this.vitesse;
			}
		} else if (this.click == 'ArrowUp') {
			if (this.y > 0) {
				this.y -= this.vitesse;
			}
		} else if (this.click == 'ArrowDown') {
			if (this.y < this.canvas.height - this.image.height) {
				this.y += this.vitesse;
			}
		}
	}

	perdreVie() {
		this.vies--;
	}

	gagnerVie() {
		this.vies++;
	}

	enVie() {
		return this.vies > 0;
	}
}
