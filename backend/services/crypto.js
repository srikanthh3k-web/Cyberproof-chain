const crypto = require('crypto');

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function createSampleEvidenceHash(seed = 'cyberproof-chain') {
  return sha256(seed);
}

module.exports = { sha256, createSampleEvidenceHash };
