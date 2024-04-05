import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Enemi from './enemis.js';

describe('constructor', () => {
	it('devrait initialiser x, y, difficulté, vies, vx, vy', () => {
		const imageEnemi = 'image';
		const enemi = new Enemi(0, 0, imageEnemi, 1);
		assert.strictEqual(enemi.getX(), 0);
		assert.strictEqual(enemi.getY(), 0);
		assert.strictEqual(enemi.getDifficulte(), 1);
		assert.strictEqual(enemi.getVies(), 2);
		assert.strictEqual(enemi.getVx(), 8);
		assert.strictEqual(enemi.getVy(), 0);
	});
});

describe('deplacer', () => {
	it(`devrait avancer enemi Simple`, () => {
		const imageEnemi = 'image';
		const enemi = new Enemi(0, 0, imageEnemi, 1);
		enemi.deplacer();
		assert.strictEqual(enemi.getX(), -8);
		assert.strictEqual(enemi.getY(), 0);
		enemi.deplacer();
		assert.strictEqual(enemi.getX(), -16);
		assert.strictEqual(enemi.getY(), 0);
	});
	it(`devrait avancer et monter enemi Moyen`, () => {
		const imageEnemi = 'image';
		const enemi2 = new Enemi(0, 0, imageEnemi, 2);
		enemi2.setVy(2);
		enemi2.deplacer();
		assert.strictEqual(enemi2.getX(), -8);
		assert.strictEqual(enemi2.getY(), 2);
		enemi2.deplacer();
		assert.strictEqual(enemi2.getX(), -16);
		assert.strictEqual(enemi2.getY(), 4);
	});
});

describe('perderVie', () => {
	it(`devrait perdre une vie`, () => {
		const imageEnemi = 'image';
		const enemi = new Enemi(0, 0, imageEnemi, 1);
		assert.strictEqual(enemi.getVies(), 2);
		enemi.perdreVie();
		assert.strictEqual(enemi.getVies(), 1);
		enemi.perdreVie();
		assert.strictEqual(enemi.getVies(), 0);
		enemi.perdreVie();
	});
});
