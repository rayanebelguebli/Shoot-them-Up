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
		assert.strictEqual(enemi.getVx(), 3);
		assert.strictEqual(enemi.getVy(), 0);
		const enemi2 = new Enemi(0, 0, imageEnemi, 2);
		assert.strictEqual(enemi2.getX(), 0);
		assert.strictEqual(enemi2.getY(), 0);
		assert.strictEqual(enemi2.getDifficulte(), 2);
		assert.strictEqual(enemi2.getVies(), 2);
		assert.strictEqual(enemi2.getVx(), 5);
		assert.strictEqual(enemi2.getVy(), 1);
		const enemi3 = new Enemi(0, 0, imageEnemi, 3);
		assert.strictEqual(enemi3.getX(), 0);
		assert.strictEqual(enemi3.getY(), 0);
		assert.strictEqual(enemi3.getDifficulte(), 3);
		assert.strictEqual(enemi3.getVies(), 2);
		assert.strictEqual(enemi3.getVx(), 20);
		assert.strictEqual(enemi3.getVy(), 16);
	});
});

describe('deplacer', () => {
	it(`devrait avancer enemi Simple`, () => {
		const imageEnemi = 'image';
		const enemi = new Enemi(0, 0, imageEnemi, 1);
		enemi.deplacer();
		assert.strictEqual(enemi.getX(), -3);
		assert.strictEqual(enemi.getY(), 0);
		enemi.deplacer();
		assert.strictEqual(enemi.getX(), -6);
		assert.strictEqual(enemi.getY(), 0);
	});
	it(`devrait avancer et monter enemi Moyen`, () => {
		const imageEnemi = 'image';
		const enemi2 = new Enemi(0, 0, imageEnemi, 2);
		enemi2.deplacer();
		assert.strictEqual(enemi2.getX(), -5);
		assert.strictEqual(enemi2.getY(), 1);
		enemi2.deplacer();
		assert.strictEqual(enemi2.getX(), -10);
		assert.strictEqual(enemi2.getY(), 2);
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
