const assert = require('assert');
const { detectHepatitis } = require('../utils/diagnosisEngine');

const lowRisk = detectHepatitis({
  fever: true,
  fatigue: false,
  jaundice: false,
  dark_urine: false,
  abdominal_pain: false,
  nausea: false
});

assert.strictEqual(lowRisk.score, 1);
assert.strictEqual(lowRisk.result, 'Low Hepatitis Risk');

const moderateRisk = detectHepatitis({
  fever: true,
  fatigue: true,
  jaundice: false,
  dark_urine: false,
  abdominal_pain: false,
  nausea: false
});

assert.strictEqual(moderateRisk.score, 2);
assert.strictEqual(moderateRisk.result, 'Moderate Hepatitis Risk');

const possibleInfection = detectHepatitis({
  fever: true,
  fatigue: true,
  jaundice: true,
  dark_urine: true,
  abdominal_pain: false,
  nausea: false
});

assert.strictEqual(possibleInfection.score, 4);
assert.strictEqual(possibleInfection.result, 'Possible Hepatitis Infection');

console.log('Diagnosis engine tests passed');
