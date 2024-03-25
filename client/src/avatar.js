import { Projectile } from './Projectile.js';
import { Hitbox } from './hitbox.js';
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
	hitbox;

	constructor(nom, vitesse) {
		this.nom = nom;
		this.score = 0;
		this.y = 0;
		this.x = 0;
		this.vies = 3;
		this.click = [];
		this.vitesse = vitesse;
		this.projectiles = [];
		this.hitbox = new Hitbox(68, 145, this.x, this.y);
	}

	incrementScore(nb) {
		this.score += nb;
	}

	decrementScore(nb) {
		this.score -= nb;
	}

	tirer() {
		let projectile = new Projectile(this.x, this.y);
		this.projectiles.push(projectile);
	}

	dessinerProjectiles(canvas, context, imageProjectile) {
		this.projectiles.forEach(projectile => {
			projectile.dessiner(canvas, context, imageProjectile);
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
			this.click[event.keyCode] = true;
		} else if (event.type == 'keyup') {
			this.click[event.keyCode] = false;
		}
	}

	deplacer() {
		if (this.click[37]) {
			if (this.x > 0) {
				this.x -= this.vitesse;
				this.hitbox.x -= this.vitesse;
			}
		}
		if (this.click[39]) {
			if (this.x < this.canvas.width - this.image.width) {
				this.x += this.vitesse;
				this.hitbox.x += this.vitesse;
			}
		}
		if (this.click[38]) {
			if (this.y > 0) {
				this.y -= this.vitesse;
				this.hitbox.y -= this.vitesse;
			}
		}
		if (this.click[40]) {
			if (this.y < this.canvas.height - this.image.height) {
				this.y += this.vitesse;
				this.hitbox.y += this.vitesse;
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
