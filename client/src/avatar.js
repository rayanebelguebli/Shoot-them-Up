import { Projectile } from './Projectile.js';
import Entite from './entite.js';
import { Hitbox } from './hitbox.js';
export class Avatar extends Entite {
	nom;
	vies;
	click;
	vitesse;
	canvasSize;
	projectiles;
	score;
	inertie;
	momentumX;
	momentumY;
	statut;
	statutTime;

	constructor(nom, id, canvasSize) {
		super(0, 0, new Hitbox(68, 145, 0, 0), null);
		this.nom = nom;
		this.score = 0;
		this.vies = 3;
		this.click = [];
		this.vitesse = 1;
		this.projectiles = [];
		this.inertie = 0.9;
		this.momentumX = 0;
		this.momentumY = 0;
		this.canvasSize = canvasSize;
		this.id = id;
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

	dessinerProjectiles(canvas, context) {
		this.projectiles.forEach(projectile => {
			if (!projectile.dessiner(canvas, context)) {
				this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
			}
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

	getClick() {
		return this.click;
	}

	setStatut(statut) {
		this.statut = statut;
	}

	setStatutTime(statutTime) {
		this.statutTime = statutTime;
	}

	getStatut() {
		return this.statut;
	}

	getStatutTime() {
		return this.statutTime;
	}

	colision(x, y, image) {
		this.projectiles.forEach(element => {
			if (element.colision(x, y, image)) {
				//console.log('colision');
			} else {
				//console.log('pas colison');
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
				this.momentumX -= this.vitesse;
			}
		}
		if (this.click[39]) {
			if (this.x < this.canvasSize.width - 68) {
				this.x += this.vitesse;
				this.hitbox.x += this.vitesse;
				this.momentumX += this.vitesse;
			}
		}
		if (this.click[38]) {
			if (this.y > 0) {
				this.y -= this.vitesse;
				this.hitbox.y -= this.vitesse;
				this.momentumY -= this.vitesse;
			}
		}
		if (this.click[40]) {
			if (this.y < this.canvasSize.height - 145) {
				this.y += this.vitesse;
				this.hitbox.y += this.vitesse;
				this.momentumY += this.vitesse;
			}
		}
		if (
			(this.x >= 0 && this.momentumX <= 0) ||
			(this.x <= this.canvasSize.width - 68 && this.momentumX >= 0)
		) {
			this.x += this.momentumX;
			this.hitbox.x = this.x;
		}

		if (
			(this.y >= 0 && this.momentumY <= 0) ||
			(this.y <= this.canvasSize.height - 145 && this.momentumY >= 0)
		) {
			this.y += this.momentumY;
			this.hitbox.y = this.y;
		}

		this.momentumX *= this.inertie;
		this.momentumY *= this.inertie;
	}

	perdreVie() {
		this.vies--;
	}

	gagnerVie() {
		this.vies++;
	}

	initAvatar() {
		this.score = 0;
		this.y = 0;
		this.x = 0;
		this.vies = 3;
		this.click = [];
		this.projectiles = [];
		this.hitbox = new Hitbox(68, 145, this.x, this.y);
	}

	enVie() {
		return this.vies > 0;
	}
}
