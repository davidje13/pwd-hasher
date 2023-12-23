import 'lean-test';
import { Hasher } from './Hasher.mjs';

describe('Hasher', () => {
  const hasher = new Hasher({ workFactor: 4 });

  describe('hash', () => {
    it('returns an ASCII-safe hash', async () => {
      const hash = await hasher.hash('abc');

      expect(hash, matches(/^[ -~]+$/));
    });

    it('generates different hashes for different inputs', async () => {
      const hash1 = await hasher.hash('abc');
      const hash2 = await hasher.hash('def');

      expect(hash1, not(equals(hash2)));
    });

    it('generates different hashes for the same input', async () => {
      const hash1 = await hasher.hash('abc');
      const hash2 = await hasher.hash('abc');

      expect(hash1, not(equals(hash2)));
    });
  });

  describe('compare', () => {
    it('returns true for hashes of the same input', async () => {
      const hash = await hasher.hash('abc');

      expect(await hasher.compare('abc', hash), isTrue());
    });

    it('returns false for hashes of a different input', async () => {
      const hash = await hasher.hash('abc');

      expect(await hasher.compare('nope', hash), isFalse());
    });

    it('does not truncate long inputs', async () => {
      const prefix = '0'.repeat(72);
      const hash = await hasher.hash(`${prefix}1`);

      expect(await hasher.compare(`${prefix}1`, hash), isTrue());
      expect(await hasher.compare(`${prefix}2`, hash), isFalse());
    });

    it('uses the number of rounds from the hashed value', async () => {
      const hasher2 = new Hasher({ workFactor: 100 });
      const hash = await hasher.hash('abc');

      expect(await hasher2.compare('abc', hash), isTrue());
      expect(await hasher2.compare('nope', hash), isFalse());
    });

    it('returns false for hashes with a different pepper', async () => {
      const hasher1 = new Hasher({ secretPepper: 'pepper1', workFactor: 4 });
      const hasher2 = new Hasher({ secretPepper: 'pepper2', workFactor: 4 });
      const hash = await hasher1.hash('abc');

      expect(await hasher2.compare('abc', hash), isFalse());
    });

    it('uses an unchanging hash format across versions', async () => {
      const hasher2 = new Hasher({ secretPepper: 'pepper1', workFactor: 4 });
      const hash =
        '$2b$04$8zwdVI7Thf4w5dOqNLfnBO0ZET7DKCOgpQML0rfTuKwOVY6XMSN0u';

      expect(await hasher2.compare('abc', hash), isTrue());
    });
  });

  describe('needsRegenerate', () => {
    it('returns true if the hash uses too few rounds', async () => {
      const hasher1 = new Hasher({ workFactor: 4 });
      const hasher2 = new Hasher({ workFactor: 6 });
      const hash = await hasher1.hash('abc');

      expect(hasher2.needsRegenerate(hash), isTrue());
    });

    it('returns false if the hash uses sufficient rounds', async () => {
      const hasher1 = new Hasher({ workFactor: 8 });
      const hasher2 = new Hasher({ workFactor: 6 });
      const hash = await hasher1.hash('abc');

      expect(hasher1.needsRegenerate(hash), isFalse());
      expect(hasher2.needsRegenerate(hash), isFalse());
    });
  });
});
