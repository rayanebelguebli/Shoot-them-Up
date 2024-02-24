export class Avatar {
	y;
	x;
	nom;
	vies;
	click;
	vitesse;
	image;
	canvas;

	constructor(nom, vitesse) {
		this.nom = nom;
		this.y = 0;
		this.x = 0;
		this.vies = 3;
		this.click = null;
		this.vitesse = vitesse;
	}

	setImageCanvas(image, canvas) {
		this.image = image;
		this.canvas = canvas;
	}

	getVies() {
		return this.vies;
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

	changerClick(event) {
		if (event.type == 'keydown') {
			this.click = event.key;
			//this.deplacer();
		} else if (event.type == 'keyup') {
			this.click = null;
		}
	}

	deplacer() {
		console.log(this.getX());
		console.log(this.getY());

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
