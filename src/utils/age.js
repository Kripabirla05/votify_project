// Age eligibility rules for the platform. Both limits are checked wherever a
// date of birth is captured - voter and candidate registration, the candidacy
// nomination form, and profile edits - so a single change here moves the rule
// everywhere.
export const MIN_VOTER_AGE = 18;
export const MIN_CANDIDATE_AGE = 21;

export const minAgeForRole = (role) => (role === 'candidate' ? MIN_CANDIDATE_AGE : MIN_VOTER_AGE);

// Completed years between `dob` and today; null when the date is missing or
// unparseable, so callers can tell "no answer" apart from "too young".
export const calculateAge = (dob) => {
  if (!dob) return null;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age -= 1;
  }
  return age;
};

// Latest date of birth that still satisfies `minAge`, formatted for a date
// input's `max` attribute so the picker itself blocks ineligible dates.
export const maxDobForAge = (minAge) => {
  const today = new Date();
  const cutoff = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  return cutoff.toISOString().split('T')[0];
};

// Returns an error message, or null when the date of birth is acceptable.
export const validateDob = (dob, minAge, subject = 'You') => {
  if (!dob) return 'Date of birth is required';

  const age = calculateAge(dob);
  if (age === null) return 'Please enter a valid date of birth';
  if (age < 0) return 'Date of birth cannot be in the future';
  if (age < minAge) return `${subject} must be at least ${minAge} years old (currently ${age})`;
  if (age > 120) return 'Please enter a valid date of birth';

  return null;
};

// "22 Jul 2003" - a compact, unambiguous display format.
export const formatDob = (dob) => {
  if (!dob) return '';
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
