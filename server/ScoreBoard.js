import fs from 'fs';

export class GestionScore {
	constructor(jsonFilePath) {
		this.jsonFilePath = jsonFilePath;
	}

	afficherScores() {
		try {
			const data = fs.readFileSync(this.jsonFilePath);
			const scores = JSON.parse(data);

			// Trier les scores par ordre décroissant
			scores.results.sort((a, b) => b.score - a.score);

			let html =
				'<table><thead><tr><th>Nom</th><th>Score</th></tr></thead><tbody>';

			// Afficher les 10 premiers résultats
			const numberOfResults = Math.min(10, scores.results.length);
			for (let i = 0; i < numberOfResults; i++) {
				const result = scores.results[i];
				html += `<tr><td>${result.nom}</td><td>${result.score}</td></tr>`;
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
