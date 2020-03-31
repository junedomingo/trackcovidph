import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext, ConfirmedOFWResponse } from '../types';

@Resolver()
export class ConfirmedOFWResolver {
  @Query(() => [ConfirmedOFWResponse])
  async confirmedOFWs(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedOFWs();
    const data = features.map(
      ({ attributes: attr }): ConfirmedOFWResponse => ({
        case_id: attr.Case_numbe,
        age: attr.age,
        coordinates: {
          lat: attr.latitude,
          lng: attr.longitude,
        },
        date_confirmed: attr.date_confi,
        date_reported: attr.date_repor,
        country: attr.country,
        remarks: attr.remarks,
        sex: attr.sex,
        status: attr.status,
      })
    );

    return data;
  }
}
