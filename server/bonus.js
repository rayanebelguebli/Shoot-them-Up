import Entite from '../client/src/entite.js';
import { Hitbox } from '../client/src/hitbox.js';
export default class Bonus extends Entite {
	nom;
	taille;
	apparition;

	constructor(choix, taille, x, y, time) {
		super(x, y, new Hitbox(75, 75, x, y), null);
		this.choix = choix;
		this.taille = taille;
		this.apparition = time;
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
