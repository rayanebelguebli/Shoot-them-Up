import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Projectile } from './Projectile.js';

describe('Projectile, déplacer ', () => {
	it('devrait faire déplacer le projectile vers la droite', () => {
		const image = { width: 20, height: 20 };
		const projectile = new Projectile(0, 0, image);
		assert.strictEqual(projectile.getX(), 0);
		projectile.deplacer();
		assert.strictEqual(projectile.getX(), 10);
		projectile.deplacer();
		assert.strictEqual(projectile.getX(), 20);
	});

	it('devrait ne pas faire déplacer le projectile en y', () => {
		const image = { width: 20, height: 20 };
		const projectile = new Projectile(0, 0, image);
		assert.strictEqual(projectile.getY(), 0);
		projectile.deplacer();
		assert.strictEqual(projectile.getY(), 0);
		projectile.deplacer();
		assert.strictEqual(projectile.getY(), 0);
	});
});

describe('Test de la fonction colision', () => {
	it("devrait retourner true si les coordonnées sont à l'intérieur de la zone de collision", () => {
		const image = { width: 20, height: 20 };
		const projectile = new Projectile(10, 10, image);
		const result = projectile.colision(15, 15, image);
		assert.strictEqual(result, true);
	});

	it("devrait retourner false si les coordonnées sont à l'extérieur de la zone de collision", () => {
		const image = { width: 20, height: 20 };
		const projectile = new Projectile(10, 10, image);
		const result = projectile.colision(41, 41, image);
		assert.strictEqual(result, false);
	});
});
