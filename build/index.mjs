import { webcrypto } from 'node:crypto';
import bcrypt from 'bcryptjs';

// adds random brute-force salt to bcrypt algorithm
// (results in average ~1.8x work for incorrect passwords)

const BRUTE_SALTS = '01234567'.split('');

function pickBruteSalt() {
  const buf = new Uint8Array(1);
  webcrypto.getRandomValues(buf);
  return BRUTE_SALTS[buf[0] % BRUTE_SALTS.length];
}

function shuffle(list) {
  // randomisation is just to vary response
  // times to reduce average server load;
  // cryptographic randomness is not required here

  // Thanks, https://stackoverflow.com/a/6274381/1180785
  const result = list.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = result[i];
    result[i] = result[j];
    result[j] = t;
  }
  return result;
}

async function preprocess(password, secretPepper, bruteSalt) {
  // use SHA to ensure no max length
  // (which would make it possible to brute-force the secretPepper)
  const buf = await webcrypto.subtle.digest(
    'SHA-512',
    Buffer.from(`${password}${bruteSalt}${secretPepper}`, 'utf8'),
  );
  return Buffer.from(buf).toString('base64');
}

class Hasher {
  constructor({ secretPepper = '', workFactor = 10 } = {}) {
    this.secretPepper = secretPepper;
    this.workFactor = workFactor;
  }

  async hash(data) {
    const bruteSalt = pickBruteSalt();
    return bcrypt.hash(
      await preprocess(data, this.secretPepper, bruteSalt),
      this.workFactor,
    );
  }

  async compare(data, hash) {
    for (const salt of shuffle(BRUTE_SALTS)) {
      const match = await bcrypt.compare(
        await preprocess(data, this.secretPepper, salt),
        hash,
      );
      if (match) {
        return true;
      }
    }
    return false;
  }

  needsRegenerate(hash) {
    return bcrypt.getRounds(hash) < this.workFactor;
  }
}

export { Hasher };
