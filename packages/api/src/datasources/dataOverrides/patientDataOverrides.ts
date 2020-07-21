import { Patient } from '../../types/graphql';
import { toDate } from '../../utils';

/**
 * eg.
 * { case_id: 'PH1', travel_history: ['Hong Kong', 'Singapore'] }
 */
export const patientDataOverrides: Omit<Patient, 'strToParse' | 'id'>[] = [
  {
    case_id: 'PH1',
    date_confirmed: toDate('1/30/2020'),
  },
];
