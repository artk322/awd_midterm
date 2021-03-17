/* eslint-disable no-unused-vars */
const { randomBytes, createHash } = require('crypto');

const salt = randomBytes(512);

export default async _ => {
  const hash = createHash('sha256');
  hash.update(salt);
  hash.update(Date.now().toString());
  const hash_val = hash.digest('base64');
  const ds_challenge = `<challenge>${hash_val}</challenge>`;
  return ds_challenge;
};
