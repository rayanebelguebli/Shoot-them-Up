import setHtml from './setHtml.js';
import { Coordinate } from './Coordinate.js';

export default class Afficher {
	static afficherCredits(event) {
		event.preventDefault();
		document.querySelector('.divMain').innerHTML = setHtml.credits();
		console.log(document.querySelector('.retourMenu'));
		document
			.querySelector('.retourMenu')
			.addEventListener('click', Afficher.afficherMenu);
	}

	static afficherMenu(event) {
		event.preventDefault();
		console.log('afficherMenu');
		document.querySelector('.divMain').innerHTML = setHtml.menu();
		document
			.querySelector('.buttonStart')
			.addEventListener('click', Afficher.startGame);
		document
			.querySelector('.credits')
			.addEventListener('click', Afficher.afficherCredits);
	}

	static afficherFinDePartie() {
		canvas.style.display = 'none';
		document.querySelector('.animation').style.display = '';
		document.querySelector('.divMain').innerHTML = setHtml.finDePartie(
			avatar,
			t
		);
		document
			.querySelector('.retourMenu')
			.addEventListener('click', Afficher.afficherMenu);
		return false;
	}

	static startGame(event) {
		event.preventDefault();
		const canvas = document.querySelector('.gameCanvas');
		canvas.style.display = '';
		document.querySelector('.divMain').innerHTML = setHtml.vide();
		document.querySelector('.animation').style.display = 'none';
		const canvasSize = new Coordinate(canvas.clientWidth, canvas.clientHeight);
		return canvasSize;
	}
}
