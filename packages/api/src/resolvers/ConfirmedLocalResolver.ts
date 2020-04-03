import { Ctx, Query, Resolver } from 'type-graphql';

import {
  Patient,
  Sibling,
  Niece,
  Nephew,
  Contact,
  Relative,
  HouseholdMember,
  Exposure,
} from '../types/graphql';
import {
  toDate,
  toAge,
  getMatchedCase,
  getChild,
  getSibling,
  getChildsParent,
  getUnique,
  getWife,
  getHusband,
} from '../utils';
import {
  AppContext,
  ArcGISConfirmedLocalAttrs,
  Child,
  GetChildParams,
  GetSiblingParams,
} from '../types/interfaces';
import { REL, SEX } from '../conts';
@Resolver()
export class ConfirmedLocalResolver {
  @Query(() => [Patient])
  async confirmedLocals(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedLocals();
    const allChildren: Child[] = [];
    const allSiblings: Sibling[] = [];
    const allNieces: Niece[] = [];
    const allNephews: Nephew[] = [];
    const allContacts: Contact[] = [];
    const allRelatives: Relative[] = [];
    const allHouseholdMembers: HouseholdMember[] = [];
    const allExposures: Exposure[] = [];
    const data = features.map(
      ({ attributes: attrs }: ArcGISConfirmedLocalAttrs): Patient => {
        let childObj: Child = Object.assign({});
        let siblingObj: Sibling = Object.assign({});
        const strToParse = attrs.travel_hx;
        const caseID = attrs.PH_masterl;
        const getChildParams: GetChildParams = {
          child: caseID,
          parent: null,
          features,
          caseIDFieldName: 'PH_masterl',
          sexFieldName: 'kasarian',
        };
        const getSiblingParam: GetSiblingParams = {
          caseID: caseID,
          sibling: null,
          features,
          caseIDFieldName: 'PH_masterl',
          sexFieldName: 'kasarian',
        };

        /**
         * Get matched children of the parent
         */
        const matchedChildsParents =
          getMatchedCase(strToParse, REL.SON) || getMatchedCase(strToParse, REL.DAUGHTER);

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
          getMatchedCase(strToParse, REL.BROTHER) || getMatchedCase(strToParse, REL.SISTER);

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
        const matchedNieces = getMatchedCase(strToParse, REL.NIECE);

        if (matchedNieces) {
          matchedNieces.map(ofCaseID => {
            allNieces.push({
              case_id: ofCaseID,
              niece: caseID,
            });
          });
        }

        /**
         * Get mathced nephews
         */
        const matchedNephews = getMatchedCase(strToParse, REL.NEPHEW);

        if (matchedNephews) {
          matchedNephews.map(ofCaseID => {
            allNephews.push({
              case_id: ofCaseID,
              nephew: caseID,
            });
          });
        }

        /**
         * Get matched contacts
         */
        const matchedContacts = getMatchedCase(strToParse, REL.CONTACT);

        if (matchedContacts) {
          matchedContacts.map(ofCaseID => {
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
        const matchedRelatives = getMatchedCase(strToParse, REL.RELATIVE);

        if (matchedRelatives) {
          matchedRelatives.map(ofCaseID => {
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
          getMatchedCase(strToParse, REL.HOUSEHOLD) ||
          getMatchedCase(strToParse, REL.HOUSEHOLD_MEMBER);

        if (matchedHouseholdMembers) {
          matchedHouseholdMembers.map(ofCaseID => {
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
          getMatchedCase(strToParse, REL.EXPOSURE, 'to') ||
          getMatchedCase(strToParse, REL.EXPOSURE_HISTORY, 'to');

        if (matchedExposures) {
          matchedExposures.map(ofCaseID => {
            allExposures.push({
              case_id: caseID,
              exposure: ofCaseID,
            });
          });
        }

        const mother = getChildsParent(caseID, allChildren, SEX.FEMALE);
        const father = getChildsParent(caseID, allChildren, SEX.MALE);
        const children = allChildren
          .filter(({ parent }) => parent === caseID)
          .map(({ child }) => child);

        const siblings = allSiblings
          .filter(sibling => sibling.case_id === caseID)
          .map(sibling => sibling);
        const uniqueSiblings = getUnique<Sibling>(siblings, 'sibling');

        const nieces = allNieces.filter(niece => niece.case_id === caseID).map(niece => niece);
        const nephews = allNephews
          .filter(nephew => nephew.case_id === caseID)
          .map(nephew => nephew);

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

        const wife = getWife(strToParse);
        const husband = getHusband(strToParse);

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

        return {
          case_id: attrs.PH_masterl,
          date_confirmed: toDate(attrs.confirmed),
          date_reported: toDate(attrs.petsa),
          age: toAge(attrs.edad),
          sex: attrs.kasarian,
          status: attrs.status,
          travel_history: attrs.travel_hx,
          nationality: attrs.nationalit,
          facility: attrs.facility,
          symptoms: attrs.symptoms,
          coordinates: {
            lat: attrs.latitude,
            lng: attrs.longitude,
          },
          relationships,
        };
      }
    );

    return data;
  }

  async test() {}
}
