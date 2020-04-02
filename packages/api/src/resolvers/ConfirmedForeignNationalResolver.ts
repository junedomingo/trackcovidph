import { Ctx, Query, Resolver } from 'type-graphql';

import { ConfirmedForeignNationalResponse } from '../types/graphql';
import { AppContext } from '../types/interfaces';

@Resolver()
export class ConfirmedForeignNationalResolver {
  @Query(() => [ConfirmedForeignNationalResponse])
  async confirmedForeignNationals(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedForeignNationals();
    const data = features.map(
      ({ attributes: attr }): ConfirmedForeignNationalResponse => ({
        case_id: attr.FN_masterl,
        age: attr.edad,
        coordinates: {
          lat: attr.latitude,
          lng: attr.longitude,
        },
        date_confirmed: attr.confirmed,
        nationality: attr.nationalit,
        status: attr.status,
        travel_date: attr.travel_dat,
        travel_history: attr.travel_his,
        where_now: attr.where_now,
      })
    );

    return data;
  }
}
