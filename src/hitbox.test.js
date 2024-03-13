import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Hitbox } from './hitbox.js';

describe('colision', () => {
	it('devrait etre en colision', () => {
		const hitbox1 = new Hitbox(100, 100, 200, 200);
		const hitbox2 = new Hitbox(100, 100, 150, 150);
		assert.strictEqual(hitbox1.colision(hitbox2), true);
	});
	it('devrait ne pas etre en colision', () => {
		const hitbox1 = new Hitbox(100, 100, 1000, 1000);
		const hitbox2 = new Hitbox(100, 100, 150, 150);
		assert.strictEqual(hitbox1.colision(hitbox2), false);
	});
});
