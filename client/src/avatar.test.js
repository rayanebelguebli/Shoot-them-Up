import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Avatar } from './avatar.js';

describe('constructor', () => {
	it('devrait initialiser x, y, vies, name', () => {
		const avatar = new Avatar('nom', 3);
		assert.strictEqual(avatar.getNom(), 'nom');
		assert.strictEqual(avatar.getX(), 0);
		assert.strictEqual(avatar.getY(), 0);
		assert.strictEqual(avatar.getVies(), 3);
	});
});

describe('changerClick', () => {
	it(
		(`devrait changer variable click en fonction dans l'entrée donnée`,
		() => {
			const avatar = new Avatar('nom', 3);
			avatar.changerClick({ type: 'keydown', keyCode: 40 });
			assert.strictEqual(avatar.getClick()[40], true);
			avatar.changerClick({ type: 'keydown', keyCode: 38 });
			assert.strictEqual(avatar.getClick()[38], true);
			avatar.changerClick({ type: 'keydown', keyCode: 39 });
			assert.strictEqual(avatar.getClick()[39], true);
		})
	);
});

describe('perderVie', () => {
	it(
		(`devrait perdre une vie`,
		() => {
			const avatar = new Avatar('nom', 5);
			avatar.perdreVie();
			assert.strictEqual(avatar.getVies(), 2);
			avatar.perdreVie();
			assert.strictEqual(avatar.getVies(), 1);
			avatar.perdreVie();
			assert.strictEqual(avatar.getVies(), 0);
		})
	);
});

describe('gagnerVie', () => {
	it(
		(`devrait gagner une vie`,
		() => {
			const avatar = new Avatar('nom', 5);
			avatar.gagnerVie();
			assert.strictEqual(avatar.getVies(), 4);
			avatar.gagnerVie();
			assert.strictEqual(avatar.getVies(), 5);
			avatar.gagnerVie();
			assert.strictEqual(avatar.getVies(), 6);
		})
	);
});

describe('enVie', () => {
	it(
		(`devrait retourner true si il est en vie, false sinon`,
		() => {
			const avatar = new Avatar('nom', 5);
			avatar.perdreVie();
			assert.strictEqual(avatar.enVie(), true);
			avatar.perdreVie();
			assert.strictEqual(avatar.enVie(), true);
			avatar.perdreVie();
			assert.strictEqual(avatar.enVie(), false);
		})
	);
});

describe('incrementScore', () => {
	it(
		(`devrait incrémeter le score du nombre pris en compte`,
		() => {
			const avatar = new Avatar('nom', 3);
			avatar.incrementScore(5);
			assert.strictEqual(avatar.getScore(), 5);
			avatar.incrementScore(10);
			assert.strictEqual(avatar.getScore(), 15);
			avatar.incrementScore(1);
			assert.strictEqual(avatar.getScore(), 16);
			avatar.incrementScore(100);
			assert.strictEqual(avatar.getScore(), 116);
		})
	);
});

describe('decrementScore', () => {
	it(
		(`devrait décrementer le score du nombre pris en compte`,
		() => {
			const avatar = new Avatar('nom', 5);
			avatar.incrementScore(100);
			avatar.decrementScore(5);
			assert.strictEqual(avatar.getScore(), 95);
			avatar.decrementScore(10);
			assert.strictEqual(avatar.getScore(), 85);
			avatar.decrementScore(1);
			assert.strictEqual(avatar.getScore(), 84);
			avatar.decrementScore(50);
			assert.strictEqual(avatar.getScore(), 34);
		})
	);
});

describe('initAvatar', () => {
	it(
		(`devrait décrementer le score du nombre pris en compte`,
		() => {
			const avatar = new Avatar('nom', 5);
			avatar.incrementScore(100);
			avatar.decrementScore(5);
			assert.strictEqual(avatar.getScore(), 95);
			avatar.initAvatar();
			assert.strictEqual(avatar.getY(), 0);
			assert.strictEqual(avatar.getX(), 0);
			assert.strictEqual(avatar.getScore(), 0);
		})
	);
});
