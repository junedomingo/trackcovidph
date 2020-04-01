export const NULLABLE_VALUES = ['NONE', 'None', 'No Travel History', 'For validation'];

export const ARCGIS_DATE_FORMAT = 'M/D/YYYY';

export const WORDS_TO_REPLACE = [
  { search: 'Singapore�s', replace: "Singapore's" },
  { search: 'Nat�L', replace: 'National' },
  { search: 'Para�aque', replace: 'Parañaque' },
];

export const WORDS_TO_EXCLUDE = ['Wife is'];

export enum REL {
  HUSBAND = 'Husband',
  WIFE = 'Wife',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  RELATIVE = 'Relative',
  SISTER = 'Sister',
  BROTHER = 'Brother',
  NIECE = 'Niece',
  NEPHEW = 'Nephew',
  CONTACT = 'Contact',
  HOUSEHOLD = 'Household',
  HOUSEHOLD_MEMBER = 'Household member',
  EXPOSURE = 'With Exposure',
  EXPOSURE_HISTORY = 'With Exposure History',
}

export enum SEX {
  MALE = 'Male',
  FEMALE = 'Female',
}
