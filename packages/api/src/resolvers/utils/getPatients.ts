import {
  Child,
  GetChildParams,
  GetSiblingParams,
  Nephew,
  Niece,
  Contact,
  Relative,
  HouseholdMember,
  Exposure,
} from '../../types/interfaces';
import { Sibling, Patient } from '../../types/graphql';

import { REL, SEX, WORDS_TO_EXCLUDE } from '../../conts';
import { getUnique, getNextStr, isContainNum } from '../../utils';
import { patientDataOverrides } from '../../datasources';

function getMatchedCases(
  strToParse: string | null,
  relationship: string,
  strIden = 'of'
): string[] | null {
  const matches: string[] | null = [];
  const wordToSearch = `${relationship} ${strIden}`;
  if (strToParse && strToParse.includes(wordToSearch)) {
    const firstMatched = getNextStr(strToParse, wordToSearch)?.[1];
    firstMatched && matches.push(firstMatched);
    const secondMatched =
      getNextStr(strToParse, `${matches[0]} and`) || getNextStr(strToParse, `${matches[0]},`);

    if (secondMatched && isContainNum(secondMatched[1])) {
      matches.push(secondMatched[1]);
    }

    /**
     * Return null if strToParse contains "Wife is Sister of ..."
     * eg. in PH43
     */
    if (WORDS_TO_EXCLUDE.some((word) => strToParse.includes(word))) {
      return matches;
    }

    return matches;
  }

  return null;
}

function getWife(strToParse: string | null, patients: Patient[]): Patient | null {
  const matchedCaseID = getMatchedCases(strToParse, REL.HUSBAND)?.[0] ?? null;
  return patients.find((p) => p.case_id === matchedCaseID) || null;
}

function getHusband(strToParse: string | null, patients: Patient[]): Patient | null {
  const matchedCaseID = getMatchedCases(strToParse, REL.WIFE)?.[0] ?? null;
  return patients.find((p) => p.case_id === matchedCaseID) || null;
}

function getChildsParent(
  caseID: string,
  children: Child[],
  sex: string,
  patients: Patient[]
): Patient | null {
  const matchedCaseID =
    children
      .filter(({ child, parentSex }) => child === caseID && parentSex === sex)
      .map(({ parent }) => parent)
      .toString() || null;
  return patients.find((p) => p.case_id === matchedCaseID) || null;
}

function getChild({ child, parent, patients }: GetChildParams): Child {
  const parentSex =
    patients
      .filter(({ case_id }) => case_id === parent)
      .map(({ sex }) => sex)
      .toString() || null;

  return { child, parent, parentSex };
}

function getSibling({ caseID, sibling, patients }: GetSiblingParams): Sibling {
  const relationship =
    patients
      .filter(({ case_id }) => case_id === sibling)
      .map(({ sex }) => (sex === SEX.MALE ? REL.BROTHER : REL.SISTER))
      .toString() || null;

  return { case_id: caseID, sibling, relationship };
}

export async function getPatients(patients: Patient[]): Promise<Patient[]> {
  const allChildren: Child[] = [];
  const allSiblings: Sibling[] = [];
  const allNieces: Niece[] = [];
  const allNephews: Nephew[] = [];
  const allContacts: Contact[] = [];
  const allRelatives: Relative[] = [];
  const allHouseholdMembers: HouseholdMember[] = [];
  const allExposures: Exposure[] = [];

  const getPatientsRelationshipsData = patients.map(
    ({ ...patient }): Patient => {
      let childObj: Child = Object.assign({});
      let siblingObj: Sibling = Object.assign({});

      const strToParse: string = patient.strToParse.join(' ');
      const caseID = patient.case_id;

      const getChildParams: GetChildParams = {
        child: caseID,
        parent: null,
        patients,
      };

      const getSiblingParam: GetSiblingParams = {
        caseID: caseID,
        sibling: null,
        patients,
      };

      /**
       * Get matched children of the parent
       */
      const matchedChildsParents =
        getMatchedCases(strToParse, REL.SON) || getMatchedCases(strToParse, REL.DAUGHTER);

      if (matchedChildsParents && Array.isArray(matchedChildsParents)) {
        matchedChildsParents.map((parent: string) => {
          childObj = getChild({
            ...getChildParams,
            parent,
          });
          allChildren.push(childObj);
        });
      }

      /**
       * Get matched siblings
       */
      const matchedSiblings =
        getMatchedCases(strToParse, REL.BROTHER) || getMatchedCases(strToParse, REL.SISTER);

      if (matchedSiblings) {
        matchedSiblings.map((sibling: string) => {
          siblingObj = getSibling({
            ...getSiblingParam,
            sibling,
          });
          allSiblings.push(siblingObj);
          // need to add reverse since they are siblings
          allSiblings.push(
            Object.assign(siblingObj, {
              case_id: siblingObj.sibling,
              sibling: siblingObj.case_id,
            })
          );
        });
      }

      /**
       * Get matched nieces
       */
      const matchedNieces = getMatchedCases(strToParse, REL.NIECE);

      if (matchedNieces) {
        matchedNieces.map((ofCaseID) => {
          allNieces.push({
            case_id: ofCaseID,
            niece: caseID,
          });
        });
      }

      /**
       * Get mathced nephews
       */
      const matchedNephews = getMatchedCases(strToParse, REL.NEPHEW);

      if (matchedNephews) {
        matchedNephews.map((ofCaseID) => {
          allNephews.push({
            case_id: ofCaseID,
            nephew: caseID,
          });
        });
      }

      /**
       * Get matched contacts
       */
      const matchedContacts = getMatchedCases(strToParse, REL.CONTACT);

      if (matchedContacts) {
        matchedContacts.map((ofCaseID) => {
          allContacts.push({
            case_id: ofCaseID,
            contact: caseID,
          });
          // need to add reverse since they are contact to each other
          allContacts.push({
            case_id: caseID,
            contact: ofCaseID,
          });
        });
      }

      /**
       * Get matched relatives
       */
      const matchedRelatives = getMatchedCases(strToParse, REL.RELATIVE);

      if (matchedRelatives) {
        matchedRelatives.map((ofCaseID) => {
          allRelatives.push({
            case_id: ofCaseID,
            relative: caseID,
          });
          // need to add reverse since they are relative to each other
          allRelatives.push({
            case_id: caseID,
            relative: ofCaseID,
          });
        });
      }

      /**
       * Get matched household members
       */
      const matchedHouseholdMembers =
        getMatchedCases(strToParse, REL.HOUSEHOLD) ||
        getMatchedCases(strToParse, REL.HOUSEHOLD_MEMBER);

      if (matchedHouseholdMembers) {
        matchedHouseholdMembers.map((ofCaseID) => {
          allHouseholdMembers.push({
            case_id: ofCaseID,
            household: caseID,
          });
        });
      }

      /**
       * Get matched exposures with
       */
      const matchedExposures =
        getMatchedCases(strToParse, REL.EXPOSURE, 'to') ||
        getMatchedCases(strToParse, REL.EXPOSURE_HISTORY, 'to');

      if (matchedExposures) {
        matchedExposures.map((ofCaseID) => {
          allExposures.push({
            case_id: caseID,
            exposure: ofCaseID,
          });
        });
      }

      return patient;
    }
  );

  const patientsWithRelationshipsData = getPatientsRelationshipsData.map(
    ({ ...patient }: Patient) => {
      const strToParse: string = patient.strToParse.join(' ');
      const caseID = patient.case_id;
      const mother = getChildsParent(caseID, allChildren, SEX.FEMALE, patients);
      const father = getChildsParent(caseID, allChildren, SEX.MALE, patients);
      const children = allChildren
        .filter(({ parent }) => parent === caseID)
        .map(({ child }) => patients.find((p) => p.case_id === child));

      const siblings = allSiblings
        .filter((sibling) => sibling.case_id === caseID)
        .map((sibling) => sibling);
      const uniqueSiblings = getUnique<Sibling>(siblings, 'sibling').map((s) => ({
        sibling: patients.find((p) => p.case_id === s.sibling),
        relationship: s.relationship,
      }));

      const nieces = allNieces
        .filter((niece) => niece.case_id === caseID)
        .map((niece) => patients.find((p) => p.case_id === niece.niece));

      const nephews = allNephews
        .filter((nephew) => nephew.case_id === caseID)
        .map((nephew) => patients.find((p) => p.case_id === nephew.nephew));

      const contacts = allContacts
        .filter((contact) => contact.case_id && contact.case_id === caseID)
        .map((contact) => contact);
      const uniqueContacts = getUnique<Contact>(contacts, 'contact')
        .map((c) => patients.find((p) => p.case_id === c.contact))
        .filter((c) => c?.case_id);

      const relatives = allRelatives
        .filter((relative) => relative.case_id === caseID)
        .map((relative) => relative);
      const uniqueRelatives = getUnique<Relative>(relatives, 'relative').map((r) =>
        patients.find((p) => p.case_id === r.relative)
      );

      const householdMembers = allHouseholdMembers
        .filter((household) => household.case_id === caseID)
        .map((household) => patients.find((p) => p.case_id === household.household));

      const exposures = allExposures
        .filter((exposure) => exposure.case_id === caseID)
        .map((exposure) => patients.find((p) => p.case_id === exposure.exposure));

      const wife = getWife(strToParse, patients);
      const husband = getHusband(strToParse, patients);

      const relationships = {
        case_id: caseID,
        wife,
        husband,
        children,
        mother,
        father,
        siblings: uniqueSiblings,
        nieces,
        nephews,
        contacts: uniqueContacts,
        relatives: uniqueRelatives,
        householdMembers,
        exposures,
      };

      return Object.assign(patient, { relationships });
    }
  );

  const patientsWithDataOverrides = patientsWithRelationshipsData.map((patient) => {
    const newData = patientDataOverrides.find((override) => override.case_id === patient.case_id);
    return Object.assign(patient, newData);
  });

  return patientsWithDataOverrides;
}
