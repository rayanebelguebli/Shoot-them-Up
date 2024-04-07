import fs from 'fs';

export class GestionScore {
	constructor(jsonFilePath) {
		this.jsonFilePath = jsonFilePath;
	}

	afficherScores() {
		try {
			const data = fs.readFileSync(this.jsonFilePath);
			const scores = JSON.parse(data);
			let html =
				'<table><thead><tr><th>Nom</th><th>Score</th></tr></thead><tbody>';
			scores.results.forEach(result => {
				html += `<tr><td>${result.nom}</td><td>${result.score}</td></tr>`;
			});
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
