import { Ctx, Query, Resolver } from 'type-graphql';

import { Patient } from '../types/graphql';
import { toDate, toAge, toRelationships } from '../utils';
import { AppContext, ArcGISConfirmedLocalAttrs } from '../types/interfaces';

@Resolver()
export class ConfirmedLocalResolver {
  @Query(() => [Patient])
  async confirmedLocals(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedLocals();
    const data = features.map(
      ({ attributes: attrs }: ArcGISConfirmedLocalAttrs): Patient => {
        const { ...rels } = toRelationships(
          attrs.PH_masterl,
          'PH_masterl',
          'kasarian',
          attrs.travel_hx,
          'travel_hx',
          features
        );
        const id = attrs.PH_masterl;
        const relationships = { id, ...rels };

        console.log(relationships);
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
