import setHtml from './setHtml.js';
import { Coordinate } from '../../common/Coordinate.js';

export default class Afficher {
	gameStarted;

	constructor() {
		this.gameStarted = false;
		this.afficherMenu = this.afficherMenu.bind(this);
		this.startGame = this.startGame.bind(this);
		this.afficherScores = this.afficherScores.bind(this);
	}

	afficherCredits(event) {
		event.preventDefault();
		document.querySelector('.divMain').innerHTML = setHtml.credits();
		document.querySelector('.retourMenu').addEventListener('click', () => {
			location.reload();
		});
	}

	afficherMenu(event) {
		event.preventDefault();
		document.querySelector('.divMain').innerHTML = setHtml.menu();
		document
			.querySelector('.buttonStart')
			.addEventListener('click', this.startGame);

		location.reload();
	}

	afficherFinDePartie(canvas, score1, score2, score3, score4) {
		this.gameStarted = false;
		canvas.style.display = 'none';
		document.querySelector('.animation').style.display = '';
		document.querySelector('.divMain').innerHTML = setHtml.finDePartie(
			score1,
			score2,
			score3,
			score4
		);
		document
			.querySelector('.retourMenu')
			.addEventListener('click', this.afficherMenu);
	}

	startGame(event) {
		this.gameStarted = true;
		event.preventDefault();
		const canvas = document.querySelector('.gameCanvas');
		canvas.style.display = '';
		document.querySelector('.divMain').innerHTML = setHtml.vide();
		document.querySelector('.animation').style.display = 'none';
		const canvasSize = new Coordinate(canvas.clientWidth, canvas.clientHeight);
		return canvasSize;
	}

	isGameStarted() {
		return this.gameStarted;
	}

	afficherScores(scores) {
		const boutonRetourMenu = document.querySelector('.retourMenu');
		if (boutonRetourMenu) {
			boutonRetourMenu.removeEventListener('click', this.afficherMenu);
		}

		document.querySelector('.divMain').innerHTML =
			scores + `<button class="retourMenu">Retour au menu</button>`;

		document
			.querySelector('.retourMenu')
			.addEventListener('click', this.afficherMenu);
	}
}
