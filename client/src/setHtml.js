export default class setHtml {
	static credits() {
		return `
        <p>Julien Bouin </p>
		<p>Rayane Belguebli</p>
		<p>Mathis Decoster </p>
		<p>Groupe H</p>
		<button class="retourMenu">Retour au menu</button>`;
	}

	static finDePartie(avatar, t) {
		return `
        <h2> GAME OVER </h2>
        <h3>score : ${avatar.getScore()}</h3>
        <h3>temps : ${t.getHrs()} : ${t.getMin()} : ${t.getSec()}</h3>
        <button class="retourMenu">Retour au menu</button>
        `;
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
