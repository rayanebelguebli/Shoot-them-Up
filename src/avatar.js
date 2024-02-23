export class Avatar {
	y;
	x;
	nom;
	vies;
	canvas;
	click;

	constructor(nom) {
		this.nom = nom;
		this.y = 0;
		this.x = 0;
		this.vies = 3;
		this.click = null;
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
		if (event.equals('keydown')) {
			click = event.key;
		} else if (event.equals('keyup')) {
			click = null;
		}
	}

	deplacer() {
		switch (click) {
			case 'ArrowLeft':
				if (x > 0) {
					x -= 3;
				}
			case 'ArrowRight':
				if (x < canvas.width - image.width) {
					x -= 3;
				}

			case 'ArrowDown':
				if (y > 0) {
					y -= 3;
				}

			case 'ArrowUp':
				if (y < canvas.height - image.height) {
					y += 3;
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
