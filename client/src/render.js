import draw from './draw.js';
import { colors } from '../../common/utils.js';
export default class Render {
	imageEnemi;
	imageEnemi2;
	imageProjectile;
	imageCoeur;
	imageMortier;
	background;
	imageEnemi3;

	constructor() {
		this.imageEnemi = new Image();
		this.imageEnemi2 = new Image();
		this.imageEnemi3 = new Image();
		this.imageProjectile = new Image();
		this.imageCoeur = new Image();
		this.imageMortier = new Image();
		this.background = new Image();
		this.imageProjectile.src = '/images/bill.png';
		this.imageEnemi.src = '/images/koopa.png';
		this.imageEnemi2.src = '/images/bob_omb.png';
		this.imageEnemi3.src = '/images/boo.png';
		this.imageMortier.src = '/images/mortier.png';
		this.background.src = '/images/background2.webp';
	}

	renderProjectile(context, avatar, avatars, avatarId) {
		context.drawImage(avatar.image, avatars[avatarId].x, avatars[avatarId].y);
		if (avatars[avatarId].projectiles != undefined) {
			avatars[avatarId].projectiles.forEach(projectile => {
				context.drawImage(this.imageProjectile, projectile.x, projectile.y);
			});
		}
	}

	renderEnnemi(canvas, context, x, y, enemi) {
		if (enemi.difficulté == 1) {
			draw(canvas, context, this.imageEnemi, x, y);
		} else if (enemi.difficulté == 2) {
			draw(canvas, context, this.imageEnemi2, x, y);
		} else if (enemi.difficulté == 3) {
			draw(canvas, context, this.imageEnemi3, x, y);
		}
	}

	renderBonus(canvas, context, imgsrc, x, y) {
		let img = new Image();
		img.src = imgsrc;
		img.width = 75;
		img.height = 75;
		draw(canvas, context, img, x, y);
	}

	renderScores(i, avatar, context) {
		context.fillStyle = colors[i - 1];
		const x = 10 + i * 100;
		if (avatar.score != undefined) {
			context.fillText(avatar.score, x, 50);
		}
	}

	renderVies(avatars, context, i) {
		this.imageCoeur.src = `/images/heart1.webp`;
		for (let j = 0; j < avatars[i].vies; j++) {
			context.drawImage(
				this.imageCoeur,
				avatars[i].x + (avatars[i].vies - j) * 20 - 15,
				avatars[i].y + this.imageMortier.height,
				20,
				20
			);
		}
	}

	renderBackground(canvas) {
		canvas
			.getContext('2d')
			.drawImage(this.background, 0, 0, canvas.width, canvas.height);
	}
	renderProjectiles(context, avatars) {
		for (const avatarId in avatars) {
			const avatar = avatars[avatarId];
			context.drawImage(avatar.image, avatar.x, avatar.y);
			if (avatar.projectiles) {
				avatar.projectiles.forEach(projectile => {
					context.drawImage(this.imageProjectile, projectile.x, projectile.y);
				});
			}
		}
	}

	renderBonuses(canvas, context, bonuses) {
		bonuses.forEach(bonus => {
			let img = new Image();
			img.src = bonusImages[bonus.choix];
			img.width = 75;
			img.height = 75;
			draw(canvas, context, img, bonus.x, bonus.y);
		});
	}

	renderEnemies(canvas, context, enemies) {
		enemies.forEach(enemy => {
			let image;
			if (enemy.difficulté == 1) {
				image = this.imageEnemi;
			} else if (enemy.difficulté == 2) {
				image = this.imageEnemi2;
			} else if (enemy.difficulté == 3) {
				image = this.imageEnemi3;
			}
			draw(canvas, context, image, enemy.x, enemy.y);
		});
	}
}
