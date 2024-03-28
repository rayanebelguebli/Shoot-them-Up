import Entite from '../client/src/entite.js';
import { bonusImages } from '../client/src/choixBonus.js';
export default class Bonus extends Entite {
	nom;
	taille;
	apparition;

	constructor(choix, taille, x, y, image, time) {
		super(x, y, new Hitbox(image.width, image.height, x, y), image);
		this.choix = choix;
		this.taille = taille;
		this.apparition = time;
		this.image.src = bonusImages[choix];
	}

	estExpire(t) {
		return t - this.apparition == 60;
	}

	getChoix() {
		return this.choix;
	}
	getTaille() {
		return this.taille;
	}
}
