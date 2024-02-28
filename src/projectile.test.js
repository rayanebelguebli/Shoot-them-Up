import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Projectile } from './Projectile.js';

describe('Projectile, déplacer ', () => {
	it('devrait faire déplacer le projectile vers la droite', () => {
		const projectile = new Projectile(0, 0);
		assert.strictEqual(projectile.getX(), 0);
		projectile.deplacer();
		assert.strictEqual(projectile.getX(), 5);
		projectile.deplacer();
		assert.strictEqual(projectile.getX(), 10);
	});

	it('devrait ne pas faire déplacer le projectile en y', () => {
		const projectile = new Projectile(0, 0);
		assert.strictEqual(projectile.getY(), 0);
		projectile.deplacer();
		assert.strictEqual(projectile.getY(), 0);
		projectile.deplacer();
		assert.strictEqual(projectile.getY(), 0);
	});
});
