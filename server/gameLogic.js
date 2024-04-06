import timer from './timer.js';

export function updateGame(
	io,
	enemis,
	bonusArray,
	avatars,
	canvasSize,
	t,
	firstAvatar,
	gameStarted,
	cptConnexion
) {
	io.emit('enemis', enemis);
	io.emit('bonusArray', bonusArray);

	const areAvatarsActive = avatars.some(avatar => !avatar.spectateur);

	if (firstAvatar && areAvatarsActive) {
		handleActiveAvatars(io, avatars, updateAvatar, canvasSize, t);
	} else {
		endGame(io, t, avatars, gameStarted, cptConnexion);
	}
}

export function handleActiveAvatars(io, avatars, updateAvatar, canvasSize, t) {
	const avatarData = [];
	avatars.forEach(avatar => {
		updateAvatar(avatar, avatarData, canvasSize, t);
	});
	io.emit('avatarsData', avatarData);
}

export function updateAvatar(avatar, avatarData, canvasSize, t, enemis) {
	avatar.canvasSize = canvasSize;
	if (
		avatar.getStatut() === 'invincibilite' &&
		t.getTotalTime() - avatar.getStatutTime() === 15
	) {
		avatar.setStatut('null');
	}

	avatar.projectiles.forEach(projectile => projectile.deplacer());

	if (!avatar.spectateur) {
		avatarData.push({
			id: avatar.id,
			x: avatar.getX(),
			y: avatar.getY(),
			projectiles: avatar.projectiles,
			vies: avatar.getVies(),
			score: avatar.getScore(),
			socketId: avatar.nom,
		});
	}

	handleAvatarEnemiCollisions(avatar, enemis);
	handleAvatarBonusCollisions(avatar, t);
}

export function handleAvatarEnemiCollisions(avatar, enemis) {
	enemis.forEach(enemi => {
		if (
			enemi.hitbox.colision(avatar.hitbox) &&
			avatar.getStatut() !== 'invincibilite'
		) {
			handleAvatarEnemiCollisionEffects(avatar, enemi);
		}

		if (enemi.getVies() < 0) {
			avatar.incrementScore(5);
			enemis.splice(enemis.indexOf(enemi), 1);
		}

		enemi.deplacer();

		avatar.projectiles.forEach(projectile => {
			if (projectile.hitbox.colision(enemi.hitbox)) {
				avatar.projectiles.splice(avatar.projectiles.indexOf(projectile), 1);
				handleProjectileEnemiCollisionEffects(enemi);
			}
		});
	});
}

export function handleAvatarEnemiCollisionEffects(avatar, enemi) {
	avatar.decrementScore(5);
	enemis.splice(enemis.indexOf(enemi), 1);
	avatar.perdreVie();

	if (canLostLifeAvatar) {
		canLostLifeAvatar = false;
		setTimeout(() => {
			canLostLifeAvatar = true;
		}, 100);
	}

	if (avatar.getVies() === 0) {
		avatar.setSpectateur();
		io.emit('dead', avatar.id);
	}
}

export function handleProjectileEnemiCollisionEffects(enemi) {
	enemi.perdreVie();

	if (canLostLifeEnemi) {
		canLostLifeEnemi = false;
		setTimeout(() => {
			canLostLifeEnemi = true;
		}, 1000 / 60);
	}
}

export function handleAvatarBonusCollisions(avatar, t) {
	bonusArray.forEach(bonus => {
		if (bonus.hitbox.colision(avatar.hitbox)) {
			handleBonusCollisionEffects(avatar, bonus, t);
		}

		if (bonus.estExpire(t.getTotalTime())) {
			bonusArray.splice(bonusArray.indexOf(bonus), 1);
		}
	});
}

export function handleBonusCollisionEffects(avatar, bonus, t) {
	if (bonusNoms[bonus.getChoix()] === 'vie') {
		avatar.gagnerVie();
	} else if (bonusNoms[bonus.getChoix()] === 'invincibilite') {
		avatar.setStatut('invincibilite');
		avatar.setStatutTime(t.getTotalTime());
	}

	bonusArray.splice(bonusArray.indexOf(bonus), 1);
}

export function endGame(io, t, avatars, gameStarted, cptConnexion) {
	gameStarted = false;
	cptConnexion = 0;
	t = new timer();
	avatars.length = 0;
	io.emit('endGame', true);
}
