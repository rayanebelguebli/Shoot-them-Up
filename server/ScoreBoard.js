import fs from 'fs';

export class GestionScore {
	constructor(jsonFilePath) {
		this.jsonFilePath = jsonFilePath;
	}

	afficherScores() {
		try {
			const data = fs.readFileSync(this.jsonFilePath);
			const scores = JSON.parse(data);
			console.log('Scores actuels :');
			console.log(scores.results);
		} catch (error) {
			console.error('Erreur lors de la lecture du fichier JSON :', error);
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
