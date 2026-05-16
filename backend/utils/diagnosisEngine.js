function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function detectHepatitis(symptoms) {
  const symptomKeys = [
    'fever',
    'fatigue',
    'jaundice',
    'dark_urine',
    'abdominal_pain',
    'nausea'
  ];

  const score = symptomKeys.reduce((total, key) => {
    return total + (toBoolean(symptoms[key]) ? 1 : 0);
  }, 0);

  if (score >= 4) {
    return {
      score,
      result: 'Possible Hepatitis Infection',
      recommendation: 'Immediate medical laboratory test recommended. Request liver function tests and hepatitis serology confirmation.'
    };
  }

  if (score >= 2) {
    return {
      score,
      result: 'Moderate Hepatitis Risk',
      recommendation: 'Clinical review is advised. Monitor symptoms and consider laboratory testing if symptoms persist or worsen.'
    };
  }

  return {
    score,
    result: 'Low Hepatitis Risk',
    recommendation: 'Monitor symptoms and consult a doctor if symptoms persist. Maintain hydration, rest, and safe hygiene practices.'
  };
}

module.exports = { detectHepatitis, toBoolean };
