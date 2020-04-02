import { WORDS_TO_EXCLUDE, REL, SEX } from '../conts';
import { getUnique, isContainNum, getNextStr } from './helpers';
import {
  Sibling,
  Niece,
  Nephew,
  Contact,
  Relative,
  HouseholdMember,
  Exposure,
  Relationships,
} from '../types/graphql';
import { Child, GetChildParams, GetSiblingParams, Connections } from '../types/interfaces';

let cachedFeatures: any = null;

function getMatchedCase(
  strToParse: string,
  relationship: string,
  strIden: string = 'of'
): string[] | null {
  const matches: string[] | null = [];
  const wordToSearch = `${relationship} ${strIden}`;
  if (strToParse && strToParse.includes(wordToSearch)) {
    const firstMatched = getNextStr(strToParse, wordToSearch)![1];
    matches.push(firstMatched);
    const secondMatched =
      getNextStr(strToParse, `${matches[0]} and`) || getNextStr(strToParse, `${matches[0]},`);

    if (secondMatched && isContainNum(secondMatched[1])) {
      matches.push(secondMatched[1]);
    }

    /**
     * Return null if strToParse contains "Wife is Sister of ..."
     * eg. in PH43
     */
    if (WORDS_TO_EXCLUDE.some(word => strToParse.includes(word))) {
      return matches;
    }

    return matches;
  }

  return null;
}

function getWife(strToParse: string) {
  return getMatchedCase(strToParse, REL.HUSBAND)?.[0] ?? null;
}

function getHusband(strToParse: string) {
  return getMatchedCase(strToParse, REL.WIFE)?.[0] ?? null;
}

function getChildsParent(caseID: string, children: Child[], sex: string) {
  return (
    children
      .filter(({ child, parentSex }) => child === caseID && parentSex === sex)
      .map(({ parent }) => parent)
      .toString() || null
  );
}

function getChild({
  child,
  parent,
  features,
  caseIDFieldName,
  sexFieldName,
}: GetChildParams): Child {
  const parentSex =
    features
      .filter(({ attributes: attrs }: any) => attrs[caseIDFieldName] === parent)
      .map(({ attributes: attrs }: any) => attrs[sexFieldName])
      .toString() || null;

  return { child, parent, parentSex };
}

function getSibling({
  caseID,
  sibling,
  features,
  caseIDFieldName,
  sexFieldName,
}: GetSiblingParams): Sibling {
  const relationship =
    features
      .filter(({ attributes: attrs }: any) => attrs[caseIDFieldName] === sibling)
      .map(({ attributes: attrs }: any) =>
        attrs[sexFieldName] === SEX.MALE ? REL.BROTHER : REL.SISTER
      )
      .toString() || null;

  return {
    case_id: caseID,
    sibling,
    relationship,
  };
}

function getConnections(
  caseID: string,
  caseIDFieldName: string,
  sexFieldName: string,
  strToParseFieldName: string,
  features: any
): Connections {
  const allChildren: Child[] = [];
  const allSiblings: Sibling[] = [];
  const allNieces: Niece[] = [];
  const allNephews: Nephew[] = [];
  const allContacts: Contact[] = [];
  const allRelatives: Relative[] = [];
  const allHouseholdMembers: HouseholdMember[] = [];
  const allExposures: Exposure[] = [];
  cachedFeatures = features;
  cachedFeatures.map(({ attributes: attrs }: any) => {
    const connStrToParse = attrs[strToParseFieldName];
    const connCaseID = attrs[caseIDFieldName];

    let childObj: Child = Object.assign({});
    let siblingObj: Sibling = Object.assign({});

    const getChildParams: GetChildParams = {
      child: connCaseID,
      parent: null,
      features: cachedFeatures,
      caseIDFieldName,
      sexFieldName,
    };

    const getSiblingParam: GetSiblingParams = {
      caseID: connCaseID,
      sibling: null,
      features: cachedFeatures,
      caseIDFieldName,
      sexFieldName,
    };

    /**
     * Get matched children of the parent
     */
    const matchedChildsParents =
      getMatchedCase(connStrToParse, REL.SON) || getMatchedCase(connStrToParse, REL.DAUGHTER);

    if (matchedChildsParents && Array.isArray(matchedChildsParents)) {
      matchedChildsParents.map((parent: string) => {
        childObj = getChild({ ...getChildParams, parent });
        allChildren.push(childObj);
      });
    }

    /**
     * Get matched siblings
     */
    const matchedSiblings =
      getMatchedCase(connStrToParse, REL.BROTHER) || getMatchedCase(connStrToParse, REL.SISTER);

    if (matchedSiblings) {
      matchedSiblings.map((sibling: string) => {
        siblingObj = getSibling({ ...getSiblingParam, sibling });
        allSiblings.push(siblingObj);
        // need to add reverse since they are siblings
        allSiblings.push(
          Object.assign(siblingObj, { case_id: siblingObj.sibling, sibling: siblingObj.case_id })
        );
      });
    }

    /**
     * Get matched nieces
     */
    const matchedNieces = getMatchedCase(connStrToParse, REL.NIECE);

    if (matchedNieces) {
      matchedNieces.map(caseID => {
        allNieces.push({ case_id: caseID, niece: connCaseID });
      });
    }

    /**
     * Get mathced nephews
     */
    const matchedNephews = getMatchedCase(connStrToParse, REL.NEPHEW);

    if (matchedNephews) {
      matchedNephews.map(caseID => {
        allNephews.push({ case_id: caseID, nephew: connCaseID });
      });
    }

    /**
     * Get matched contacts
     */
    const matchedContacts = getMatchedCase(connStrToParse, REL.CONTACT);

    if (matchedContacts) {
      matchedContacts.map(caseID => {
        allContacts.push({ case_id: caseID, contact: connCaseID });
        // need to add reverse since they are contact to each other
        allContacts.push({ case_id: connCaseID, contact: caseID });
      });
    }

    /**
     * Get matched relatives
     */
    const matchedRelatives = getMatchedCase(connStrToParse, REL.RELATIVE);

    if (matchedRelatives) {
      matchedRelatives.map(caseID => {
        allRelatives.push({ case_id: caseID, relative: connCaseID });
        // need to add reverse since they are relative to each other
        allRelatives.push({ case_id: connCaseID, relative: caseID });
      });
    }

    /**
     * Get matched household members
     */
    const matchedHouseholdMembers =
      getMatchedCase(connStrToParse, REL.HOUSEHOLD) ||
      getMatchedCase(connStrToParse, REL.HOUSEHOLD_MEMBER);

    if (matchedHouseholdMembers) {
      matchedHouseholdMembers.map(caseID => {
        allHouseholdMembers.push({ case_id: caseID, household: connCaseID });
      });
    }

    /**
     * Get matched exposures with
     */
    const matchedExposures =
      getMatchedCase(connStrToParse, REL.EXPOSURE, 'to') ||
      getMatchedCase(connStrToParse, REL.EXPOSURE_HISTORY, 'to');

    if (matchedExposures) {
      matchedExposures.map(caseID => {
        allExposures.push({ case_id: caseID, exposure: connCaseID });
      });
    }
  });

  const mother = getChildsParent(caseID, allChildren, SEX.FEMALE);
  const father = getChildsParent(caseID, allChildren, SEX.MALE);
  const children = allChildren.filter(({ parent }) => parent === caseID).map(({ child }) => child);

  const siblings = allSiblings
    .filter(sibling => sibling.case_id === caseID)
    .map(sibling => sibling);
  const uniqueSiblings = getUnique<Sibling>(siblings, 'sibling');

  const nieces = allNieces.filter(niece => niece.case_id === caseID).map(niece => niece);
  const nephews = allNephews.filter(nephew => nephew.case_id === caseID).map(nephew => nephew);

  const contacts = allContacts
    .filter(contact => contact.case_id === caseID)
    .map(contact => contact);
  const uniqueContacts = getUnique<Contact>(contacts, 'contact');

  const relatives = allRelatives
    .filter(relative => relative.case_id === caseID)
    .map(relative => relative);
  const uniqueRelatives = getUnique<Relative>(relatives, 'relative');

  const householdMembers = allHouseholdMembers
    .filter(household => household.case_id === caseID)
    .map(household => household);

  const exposures = allExposures
    .filter(exposure => exposure.case_id === caseID)
    .map(exposure => exposure);

  return {
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
}

export function toRelationships(
  caseID: string,
  caseIDFieldName: string,
  sexFieldName: string,
  strToParse: string,
  strToParseFieldName: string,
  features: any
): Relationships {
  const { ...connections } = getConnections(
    caseID,
    caseIDFieldName,
    sexFieldName,
    strToParseFieldName,
    features
  );

  return {
    wife: getWife(strToParse),
    husband: getHusband(strToParse),
    ...connections,
  };
}
