import fs from 'fs';

export class GestionScore {
	constructor(jsonFilePath) {
		this.jsonFilePath = jsonFilePath;
	}

	afficherScores() {
		try {
			const data = fs.readFileSync(this.jsonFilePath);
			const scores = JSON.parse(data);

			scores.results.sort((a, b) => b.score - a.score);

			let html =
				'<table><thead><tr><th><h4>Nom</h4></th><th><h4>Score</h4></th></tr></thead><tbody>';

			const numberOfResults = Math.min(10, scores.results.length);
			for (let i = 0; i < numberOfResults; i++) {
				const result = scores.results[i];
				html += `<tr><td><h4>${result.nom}</h4></td><td><h4>${result.score}</h4></td></tr>`;
			}

			html += '</tbody></table>';
			return html;
		} catch (error) {
			console.error('Erreur lors de la lecture du fichier JSON :', error);
			return null;
		}
	}

	ajouterScore(nom, score) {
		try {
			const data = fs.readFileSync(this.jsonFilePath);
			const scores = JSON.parse(data);
			scores.results.push({ nom: nom, score: score });
			fs.writeFileSync(this.jsonFilePath, JSON.stringify(scores, null, 2));
			console.log('Score ajouté avec succès !');
		} catch (error) {
			console.error("Erreur lors de l'ajout du score :", error);
		}
	}
}
