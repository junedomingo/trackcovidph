import { Ctx, Query, Resolver } from 'type-graphql';

import { ConfirmedOFW } from '../types/graphql';
import { AppContext } from '../types/interfaces';

@Resolver()
export class ConfirmedOFWResolver {
  @Query(() => [ConfirmedOFW])
  async confirmedOFWs(@Ctx() { dataSources }: AppContext): Promise<ConfirmedOFW[]> {
    const { features } = await dataSources.ArcGISApi.getConfirmedOFWs();
    const data = features.map(
      ({ attributes: attr }): ConfirmedOFW => ({
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
