import {
  Relationships,
  Sibling,
  Child,
  GetChildParams,
  GetSiblingParams,
  Connections,
  Niece,
  Nephew,
} from '../types';
import { WORDS_TO_EXCLUDE, REL, SEX } from '../conts';
import { getUnique, isContainNum, getNextStr } from './helpers';

let cachedFeatures: any = null;

function getMatchedCase(travelHxAttr: string, relationship: string): string[] | null {
  const matches: string[] | null = [];
  const wordToSearch = `${relationship} of`;
  if (travelHxAttr && travelHxAttr.includes(wordToSearch)) {
    const firstMatched = getNextStr(travelHxAttr, wordToSearch)![1];
    matches.push(firstMatched);
    const secondMatched =
      getNextStr(travelHxAttr, `${matches[0]} and`) || getNextStr(travelHxAttr, `${matches[0]},`);

    if (secondMatched && isContainNum(secondMatched[1])) {
      matches.push(secondMatched[1]);
    }

    /**
     * Return null if travelHxAttr contains "Wife is Sister of ..."
     * eg. in PH43
     */
    if (WORDS_TO_EXCLUDE.some(word => travelHxAttr.includes(word))) {
      return matches;
    }

    return matches;
  }

  return null;
}

function getWife(travelHxAttr: string) {
  return getMatchedCase(travelHxAttr, REL.HUSBAND)?.[0] ?? null;
}

function getHusband(travelHxAttr: string) {
  return getMatchedCase(travelHxAttr, REL.WIFE)?.[0] ?? null;
}

function getChildsParent(id: string, children: Child[], sex: string) {
  return (
    children
      .filter(({ child, parentSex }) => child === id && parentSex === sex)
      .map(({ parent }) => parent)
      .toString() || null
  );
}

function getChild({ child, parent, features, idStrAttr, sexStrAttr }: GetChildParams): Child {
  const parentSex =
    features
      .filter(({ attributes: attrs }: any) => attrs[idStrAttr] === parent)
      .map(({ attributes: attrs }: any) => attrs[sexStrAttr])
      .toString() || null;

  return { child, parent, parentSex };
}

function getSibling({ id, sibling, features, idStrAttr, sexStrAttr }: GetSiblingParams): Sibling {
  const relationship =
    features
      .filter(({ attributes: attrs }: any) => attrs[idStrAttr] === sibling)
      .map(({ attributes: attrs }: any) =>
        attrs[sexStrAttr] === SEX.MALE ? REL.BROTHER : REL.SISTER
      )
      .toString() || null;

  return {
    id,
    sibling,
    relationship,
  };
}

function getConnections(
  id: string,
  idStrAttr: string,
  sexStrAttr: string,
  travelHxStrAttr: string,
  features: any
): Connections {
  const allChildren: Child[] = [];
  const allSiblings: Sibling[] = [];
  const allNieces: Niece[] = [];
  const allNephews: Nephew[] = [];
  cachedFeatures = features;
  cachedFeatures.map(({ attributes: attrs }: any) => {
    const travelHxAttr = attrs[travelHxStrAttr];
    let childObj: Child = Object.assign({});
    let siblingObj: Sibling = Object.assign({});

    const getChildParams: GetChildParams = {
      child: attrs[idStrAttr],
      parent: null,
      features: cachedFeatures,
      idStrAttr,
      sexStrAttr,
    };

    const getSiblingParam: GetSiblingParams = {
      id: attrs[idStrAttr],
      sibling: null,
      features: cachedFeatures,
      idStrAttr,
      sexStrAttr,
    };

    /**
     * Get children
     */
    const matchedChildsParents =
      getMatchedCase(travelHxAttr, REL.SON) || getMatchedCase(travelHxAttr, REL.DAUGHTER);

    if (matchedChildsParents && Array.isArray(matchedChildsParents)) {
      matchedChildsParents.map((parent: string) => {
        childObj = getChild({ ...getChildParams, parent });
        allChildren.push(childObj);
      });
    }

    /**
     * Get sibling
     */
    const matchedSiblings =
      getMatchedCase(travelHxAttr, REL.BROTHER) || getMatchedCase(travelHxAttr, REL.SISTER);

    if (matchedSiblings) {
      matchedSiblings.map((sibling: string) => {
        siblingObj = getSibling({ ...getSiblingParam, sibling });
        allSiblings.push(siblingObj);
      });
    }

    /**
     * Get nieces
     */
    const matchedNieces = getMatchedCase(travelHxAttr, REL.NIECE);

    if (matchedNieces) {
      matchedNieces.map(id => {
        allNieces.push({ id, niece: attrs[idStrAttr] });
      });
    }

    /**
     * Get nephews
     */
    const matchedNephews = getMatchedCase(travelHxAttr, REL.NEPHEW);

    if (matchedNephews) {
      matchedNephews.map(id => {
        allNephews.push({ id, nephew: attrs[idStrAttr] });
      });
    }
  });

  const mother = getChildsParent(id, allChildren, SEX.FEMALE);
  const father = getChildsParent(id, allChildren, SEX.MALE);
  const children = allChildren.filter(({ parent }) => parent === id).map(({ child }) => child);

  const filteredSiblings = allSiblings.filter(sibling => sibling.id === id).map(sibling => sibling);
  const siblings = getUnique(filteredSiblings, 'sibling') as Sibling[];

  const nieces = allNieces.filter(niece => niece.id === id).map(niece => niece);
  const nephews = allNephews.filter(nephew => nephew.id === id).map(nephew => nephew);

  return { children, mother, father, siblings, nieces, nephews };
}

export function toRelationsships(
  id: string,
  idStrAttr: string,
  sexStrAttr: string,
  travelHxAttr: string,
  travelHxStrAttr: string,
  features: any
): Relationships {
  const { mother, father, children, siblings, nieces, nephews } = getConnections(
    id,
    idStrAttr,
    sexStrAttr,
    travelHxStrAttr,
    features
  );

  return {
    wife: getWife(travelHxAttr),
    husband: getHusband(travelHxAttr),
    children,
    mother,
    father,
    siblings,
    nieces,
    nephews,
  };
}
