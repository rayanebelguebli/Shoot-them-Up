import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Avatar } from './avatar.js';

describe('constructor', () => {
	it('devrait initialiser x, y, vies and name mais pas click', () => {
		const avatar = new Avatar('nom', 3);
		assert.strictEqual(avatar.getNom(), 'nom');
		assert.strictEqual(avatar.getX(), 0);
		assert.strictEqual(avatar.getY(), 0);
		assert.strictEqual(avatar.getVies(), 3);
		assert.strictEqual(avatar.getClick(), null);
	});
});

describe('changerClick', () => {
	if (
		(`devrait changer variable click en fonction dans l'entrée donnée`,
		() => {
			const avatar = new Avatar('nom', 3);
			avatar.changerClick('keydown {key: "ArrowDown"}');
			assert.strictEqual(avatar.getClick(), 'ArrowDown');
			avatar.changerClick('keyup {key: "ArrowDown"}');
			assert.strictEqual(avatar.getClick(), null);
			avatar.changerClick('keydown {key: "ArrowRight"}');
			assert.strictEqual(avatar.getClick(), 'ArrowRight');
			avatar.changerClick('keyup {key: "ArrowRight"}');
			assert.strictEqual(avatar.getClick(), null);
		})
	);
});

describe('deplacer', () => {
	if (
		(`devrait changer variable x ou y en fonction de click`,
		() => {
			const avatar = new Avatar('nom');
			avatar.changerClick('keydown {key: "ArrowLeft"}');
			avatar.deplacer();
			assert.strictEqual(avatar.getX(), 0);
			avatar.changerClick('keyup {key: "ArrowRight"}');
			avatar.deplacer();
			assert.strictEqual(avatar.getX(), 3);
			avatar.changerClick('keyup {key: "ArrowDown"}');
			avatar.deplacer();
			assert.strictEqual(avatar.getY(), 3);
		})
	);
});

describe('perderVie', () => {
	if (
		(`devrait perdre une vie`,
		() => {
			const avatar = new Avatar('nom');
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
	if (
		(`devrait gagner une vie`,
		() => {
			const avatar = new Avatar('nom');
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
	if (
		(`devrait retourner true si il est en vie, false sinon`,
		() => {
			const avatar = new Avatar('nom');
			avatar.perdreVie();
			assert.strictEqual(avatar.enVie(), true);
			avatar.perdreVie();
			assert.strictEqual(avatar.enVie(), true);
			avatar.perdreVie();
			assert.strictEqual(avatar.enVie(), false);
		})
	);
});
