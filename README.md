# Pwd Hasher

Simple password hashing with support for salt, secret pepper, and brute-force salt.

## Install dependency

```bash
npm install --save git+https://github.com/davidje13/pwd-hasher.git#semver:^1.0.2
```

## Usage

```javascript
import Hasher from 'pwd-hasher';

const hasher = new Hasher({ secretPepper: 'shhh', workFactor: 10 });

const hashed = await hasher.hash('my-password');

const invalid = await hasher.compare('incorrect-password', hashed); // false
const valid = await hasher.compare('my-password', hashed); // true
```

### API

#### Constructor

```javascript
const hasher = new Hasher({ secretPepper, workFactor })
```

Creates a new `Hasher` object.

The `secretPepper` should be a string which is known only to the webserver (it should not be
stored in the same database as the hashes) and must not change (if it changes, all passwords
will become invalid). Typically this would be provided as an environment variable to the web
server during deployment. By default this is a blank string `''`.

The `workFactor` should be an integer which controls the amount of work required to generate
the hash. This should be tuned to take the longest possible time which still gives a good
user experience when logging in, as this will provide the greatest protection for offline
attacks against the password hash database. This value can and should change over time; if
you deploy your application to a more powerful server, the number should be raised. Each
increment approximately doubles the required work. By default this is `10`.

#### `hash`

```javascript
const hashed = await hasher.hash(password);
```

Hashes the given password using a random salt and brute-force salt.

The algorithm used is `bcrypt(sha512(password+bruteSalt+secretPepper))` (`bcrypt` provides
the `salt`). This avoids password length restrictions. The `bruteSalt` is a random integer
from 0 to 7 and provides additional protection against brute-force attacks (incorrect
passwords will take, on average, approximately twice as much effort to invalidate as correct
passwords will take to validate).

#### `compare`

```javascript
const match = await hasher.compare(password, hash);
```

Checks a password against the given hash. The configured `secretPepper` must match the value
used when generating the original hash. The `workFactor` can be different; this will always
use the work factor stored with the hash.

#### `needsRegenerate`

```javascript
const regenerate = hasher.needsRegenerate(hash);
```

Returns `true` if the hash's work factor is lower than the currently configured work factor.
In this scenario, you should re-hash the password during a successful login. For example:

```javascript
async function login(user, password) {
  const hash = await myDB.getUserHash(user);
  const success = await hasher.compare(password, hash);
  if (!success) {
    return false;
  }
  if (hasher.needsRegenerate(hash)) {
    const newHash = await hasher.hash(password);
    await myDB.saveUserHash(user, newHash);
  }
  return true;
}
```

This will ensure that old passwords are slowly updated to the latest work factor as users
log in to the application, even if the user does not update their password.
