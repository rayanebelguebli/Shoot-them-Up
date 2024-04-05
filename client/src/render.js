import draw from './draw.js';
export default class Render {
	static renderProjectile(context, avatar, avatars, avatarId, imageProjectile) {
		context.drawImage(avatar.image, avatars[avatarId].x, avatars[avatarId].y);
		if (avatars[avatarId].projectiles != undefined) {
			avatars[avatarId].projectiles.forEach(projectile => {
				context.drawImage(imageProjectile, projectile.x, projectile.y);
			});
		}
	}

	static renderEnnemi(
		canvas,
		context,
		imageEnemi,
		imageEnemi2,
		imageEnemi3,
		x,
		y,
		enemi
	) {
		if (enemi.difficulté == 1) {
			draw(canvas, context, imageEnemi, x, y);
		} else if (enemi.difficulté == 2) {
			draw(canvas, context, imageEnemi2, x, y);
		} else if (enemi.difficulté) {
			draw(canvas, context, imageEnemi3, x, y);
		}
	}

	static renderBonus(canvas, context, imgsrc, x, y) {
		let img = new Image();
		img.src = imgsrc;
		img.width = 75;
		img.height = 75;
		draw(canvas, context, img, x, y);
	}
}
