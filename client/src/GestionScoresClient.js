export class GestionScore {
	async afficherScores(fichier) {
		try {
			const response = await fetch(fichier);
			const scores = await response.json();
			let html =
				'<table><thead><tr><th>Nom</th><th>Score</th></tr></thead><tbody>';
			scores.results.forEach(result => {
				html += `<tr><td>${result.nom}</td><td>${result.score}</td></tr>`;
			});
			html += '</tbody></table>';
			console.log(html);
			return html;
		} catch (error) {
			console.error('Erreur lors de la lecture du fichier JSON :', error);
			return null;
		}
	}
}
