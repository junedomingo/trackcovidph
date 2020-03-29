import {
  Relationships,
  Sibling,
  Child,
  GetChildParams,
  GetSiblingParams,
  Connections,
} from '../types';
import { WORDS_TO_EXCLUDE, REL, SEX } from '../conts';
import { getUnique } from './helpers';

let cachedFeatures: any = null;

function getMatchedCase(
  travelHxAttr: string,
  relationship: string,
  withSecondMatch: boolean = false
): string | null {
  const wordToSearch = `${relationship} of`;
  if (travelHxAttr && travelHxAttr.includes(wordToSearch)) {
    const firstMatched = travelHxAttr.match(wordToSearch + '\\s(\\w+)')![1];
    const secondMatched =
      travelHxAttr.match(`${firstMatched} and` + '\\s(\\w+)') ||
      travelHxAttr.match(`${firstMatched},` + '\\s(\\w+)');

    if (withSecondMatch && secondMatched) {
      return secondMatched[1];
    }

    /**
     * Return null if travelHxAttr contains "Wife is Sister of ..."
     * eg. in PH43
     */
    if (WORDS_TO_EXCLUDE.some(word => travelHxAttr.includes(word))) {
      return null;
    }
    return firstMatched;
  }

  return null;
}

function getWife(travelHxAttr: string) {
  return getMatchedCase(travelHxAttr, REL.HUSBAND);
}

function getHusband(travelHxAttr: string) {
  return getMatchedCase(travelHxAttr, REL.WIFE);
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
    const firstParent =
      getMatchedCase(travelHxAttr, REL.SON) || getMatchedCase(travelHxAttr, REL.DAUGHTER);

    // If has "and" eg. "Son of PH169 and PH176" then we need also to match PH176
    const nextParent =
      getMatchedCase(travelHxAttr, REL.SON, true) ||
      getMatchedCase(travelHxAttr, REL.DAUGHTER, true);

    if (firstParent) {
      childObj = getChild({ ...getChildParams, parent: firstParent });
      allChildren.push(childObj);
    }

    if (nextParent) {
      childObj = getChild({ ...getChildParams, parent: nextParent });
      allChildren.push(childObj);
    }

    /**
     * Get sibling
     */
    const firstSibling =
      getMatchedCase(travelHxAttr, REL.BROTHER) || getMatchedCase(travelHxAttr, REL.SISTER);

    // If has "and" eg. "Sister of PH41 and PH87" then we need also to match PH87
    const nextSibling =
      getMatchedCase(travelHxAttr, REL.BROTHER, true) ||
      getMatchedCase(travelHxAttr, REL.SISTER, true);

    if (firstSibling) {
      siblingObj = getSibling({ ...getSiblingParam, sibling: firstSibling });
      allSiblings.push(siblingObj);
    }

    if (nextSibling) {
      siblingObj = getSibling({ ...getSiblingParam, sibling: nextSibling });
      allSiblings.push(siblingObj);
    }
  });

  const mother = getChildsParent(id, allChildren, SEX.FEMALE);
  const father = getChildsParent(id, allChildren, SEX.MALE);
  const children = allChildren.filter(({ parent }) => parent === id).map(({ child }) => child);
  const filteredSiblings = allSiblings
    .filter(sibling => sibling.id === id)
    .map(sibling => ({ sibling: sibling.sibling, relationship: sibling.relationship }));

  const siblings = getUnique(filteredSiblings, 'sibling') as Sibling[];
  return { children, mother, father, siblings };
}

export function toRelationsships(
  id: string,
  idStrAttr: string,
  sexStrAttr: string,
  travelHxAttr: string,
  travelHxStrAttr: string,
  features: any
): Relationships {
  const { mother, father, children, siblings } = getConnections(
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
  };
}
