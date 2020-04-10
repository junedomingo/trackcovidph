import { Patient } from '../graphql';

export interface GetChildParams {
  child: string;
  parent: string | null;
  patients: Patient[];
}

export interface GetSiblingParams {
  caseID: string;
  sibling: string | null;
  patients: Patient[];
}
