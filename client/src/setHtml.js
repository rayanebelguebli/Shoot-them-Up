export default class setHtml {
	static credits() {
		return `
        <p>Julien Bouin </p>
		<p>Rayane Belguebli</p>
		<p>Mathis Decoster </p>
		<p>Groupe H</p>
		<button class="retourMenu">Retour au menu</button>`;
	}

	static finDePartie(score1, score2, score3, score4) {
		let scoreHTML = `<h2> GAME OVER </h2>`;

		if (score1 !== undefined) {
			scoreHTML += `<h3>score joueur1 : ${score1}</h3>`;
		}
		if (score2 !== undefined) {
			scoreHTML += `<h3>score joueur2 : ${score2}</h3>`;
		}
		if (score3 !== undefined) {
			scoreHTML += `<h3>score joueur3 : ${score3}</h3>`;
		}
		if (score4 !== undefined) {
			scoreHTML += `<h3>score joueur4 : ${score4}</h3>`;
		}

		scoreHTML += `<button class="retourMenu">Retour au menu</button>`;

		return scoreHTML;
	}

	static vide() {
		return ``;
	}

	static menu() {
		return `
        <h1>Ca geek</h1>
		<button class="buttonStart">Play</button>
		<button>ScoreBoard</button>
		<button class="credits">Credits</button>`;
	}
}
