import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext, ConfirmedLocalResponse, ArcGISConfirmedLocalAttrs } from '../types';
import { toDate, toAge, toRelationsships } from '../utils';

@Resolver()
export class ConfirmedLocalResolver {
  @Query(() => [ConfirmedLocalResponse])
  async confirmedLocals(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedLocals();
    const data = features.map(
      ({ attributes: attrs }: ArcGISConfirmedLocalAttrs): ConfirmedLocalResponse => {
        const {
          children,
          wife,
          husband,
          mother,
          father,
          siblings,
          nieces,
          nephews,
        } = toRelationsships(
          attrs.PH_masterl,
          'PH_masterl',
          'kasarian',
          attrs.travel_hx,
          'travel_hx',
          features
        );
        const id = attrs.PH_masterl;
        const relationships = Object.assign(
          {},
          {
            id,
            wife,
            husband,
            mother,
            father,
            children,
            siblings,
            nieces,
            nephews,
          }
        );
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
