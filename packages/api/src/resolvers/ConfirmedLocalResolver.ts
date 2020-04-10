import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

import { Patient } from '../types/graphql';
import { toDate, toAge, toNationality, toSymptoms, toTravelHistory } from '../utils';
import { AppContext, ArcGISConfirmedLocalAttrs } from '../types/interfaces';
import { getPatients } from './utils/getPatients';
import { rateLimit } from '../middlewares';

interface GraphNode {
  id: string;
  group: string;
  color?: string;
  patientCaseID?: string;
  patientResidence?: string;
}

interface GraphLink {
  source: string;
  target: string;
}

@Resolver(() => Patient)
export class ConfirmedLocalResolver {
  generateGraphDataset(patients: Patient[]): void {
    const PH = 'Philippines';
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];

    for (const patient of patients) {
      // Add residence nodes eg. Quezon City
      if (patient.residence && !graphNodes.some((g) => g.id === patient.residence)) {
        graphNodes.push({
          id: patient.residence,
          group: patient.residence,
          color: 'violet',
        });
      }

      // Add patients nodes eg.PH1
      if (patient.residence) {
        graphNodes.push({
          id: patient.case_id,
          group: patient.residence,
          color: 'orange',
          patientCaseID: patient.case_id,
          patientResidence: patient.residence,
        });
      } else {
        graphNodes.push({
          id: patient.case_id,
          group: PH,
          color: 'orange',
        });
      }

      //get case_ids of the patient that have relationship with
      const wife = patient.relationships && patient.relationships.wife;
      const husband = patient!.relationships!.husband;
      const mother = patient!.relationships!.mother;
      const father = patient!.relationships!.father;
      const children = patient!.relationships!.children;
      const siblings = patient!.relationships!.siblings;
      const nieces = patient!.relationships!.nieces;
      const nephews = patient!.relationships!.nephews;
      const contacts = patient!.relationships!.contacts;
      const relatives = patient!.relationships!.relatives;
      const householdMembers = patient!.relationships!.householdMembers;
      const exposures = patient!.relationships!.exposures;

      if (
        wife &&
        !graphLinks.some((gl) => gl.source === patient.case_id && gl.target === husband.case_id)
      ) {
        graphLinks.push({
          source: patient.case_id,
          target: wife.case_id,
        });
      }
      if (
        husband &&
        !graphLinks.some((gl) => gl.source === husband.case_id && gl.target === patient.case_id)
      ) {
        console.log('called husband', {
          source: patient.case_id,
          target: husband.case_id,
        });
        graphLinks.push({
          source: patient.case_id,
          target: husband.case_id,
        });
      }

      if (
        mother &&
        !graphLinks.some((gl) => gl.source === patient.case_id && gl.target === mother.case_id)
      ) {
        graphLinks.push({
          source: patient.case_id,
          target: mother.case_id,
        });
      }

      if (
        father &&
        !graphLinks.some((gl) => gl.source === patient.case_id && gl.target === father.case_id)
      ) {
        graphLinks.push({
          source: patient.case_id,
          target: father.case_id,
        });
      }

      if (children.length) {
        for (const child of children) {
          graphLinks.push({
            source: patient.case_id,
            target: child.case_id,
          });
        }
      }

      // if (siblings.length) {
      //   for (const sibling of siblings) {
      //     graphLinks.push({
      //       source: patient.case_id,
      //       target: sibling.case_id
      //     })
      //   }
      // }

      // if (nieces.length) {
      //   for (const niece of nieces) {
      //     graphLinks.push({
      //       source: patient.case_id,
      //       target: niece.case_id
      //     })
      //   }
      // }

      // if (nephews.length) {
      //   for (const nephew of nephews) {
      //     graphLinks.push({
      //       source: patient.case_id,
      //       target: nephew.case_id
      //     })
      //   }
      // }

      // if (contacts.length) {
      //   for (const contact of contacts) {
      //     graphLinks.push({
      //       source: patient.case_id,
      //       target: contact.case_id
      //     })
      //   }
      // }

      // if (relatives.length) {
      //   for (const relative of relatives) {
      //     graphLinks.push({
      //       source: patient.case_id,
      //       target: relative.case_id
      //     })
      //   }
      // }

      // if (householdMembers.length) {
      //   for (const householdmember of householdMembers) {
      //     graphLinks.push({
      //       source: patient.case_id,
      //       target: householdmember.case_id
      //     })
      //   }
      // }

      // if (exposures.length) {
      //   for (const exposure of exposures) {
      //     if (exposure) {
      //       graphLinks.push({
      //         source: patient.case_id,
      //         target: exposure.case_id
      //       })
      //     }
      //   }
      // }
    }

    // Manually add Philippines as the center
    graphNodes.push({
      id: PH,
      group: PH,
      color: 'red',
    });

    const linksForResidenceToPatients = graphNodes
      .filter((g) => g.patientCaseID && g.patientResidence)
      .map((g) => ({
        source: g.patientResidence,
        target: g.patientCaseID,
      }));

    // For patients that don't have residence
    const linksForPHToPatients = patients
      .filter((p) => !p.residence && !graphNodes.some((g) => g.patientCaseID === p.case_id))
      .map((p) => ({
        source: PH,
        target: p.case_id,
      }));

    // Connect all residence to philippines
    const linksForPHToResidence = graphNodes
      .filter((g) => g.patientCaseID && g.patientResidence)
      .map((g) => ({
        source: PH,
        target: g.patientResidence,
      }));

    const dataset = {
      nodes: graphNodes,
      links: [
        ...linksForResidenceToPatients,
        ...linksForPHToResidence,
        ...linksForPHToPatients,
        ...graphLinks,
      ],
    };

    // console.log(JSON.stringify(dataset));
    // console.log(dataset)
    // console.log(patients.find(p => p.case_id ==='PH1'))
  }

  @UseMiddleware(rateLimit())
  @Query(() => [Patient])
  async confirmedLocals(@Ctx() { dataSources }: AppContext): Promise<Patient[]> {
    const { features } = await dataSources.ArcGISApi.getConfirmedLocals();

    const patientsAsParam = features.map(
      ({ attributes: attrs }: ArcGISConfirmedLocalAttrs): Patient => ({
        case_id: attrs.PH_masterl,
        date_confirmed: toDate(attrs.confirmed),
        date_reported: toDate(attrs.petsa),
        age: toAge(attrs.edad),
        sex: attrs.kasarian,
        status: attrs.status,
        residence: attrs.residence,
        travel_history: toTravelHistory(attrs.travel_hx),
        nationality: toNationality(attrs.nationalit),
        facility: {
          name: attrs.facility,
          coordinates: {
            lat: attrs.latitude,
            lng: attrs.longitude,
          },
        },
        symptoms: toSymptoms(attrs.symptoms),
        strToParse: [attrs.travel_hx],
      })
    );

    const patients = await getPatients(patientsAsParam);

    this.generateGraphDataset(patients);

    return patients;
  }
}
