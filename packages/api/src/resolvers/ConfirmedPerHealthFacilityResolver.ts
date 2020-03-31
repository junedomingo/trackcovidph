import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types';
import { ConfirmedPerHealthFacilityResponse } from '../types';

@Resolver()
export class ConfirmedPerHealthFacilityResolver {
  @Query(() => [ConfirmedPerHealthFacilityResponse])
  async confirmedByHealthFacility(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedByHealthFacility();
    const data = features.map(
      ({ attributes: attr }): ConfirmedPerHealthFacilityResponse => ({
        count: attr.count_,
        facility: attr.facility,
        coordinates: {
          lat: attr.latitude,
          lng: attr.longitude,
        },
      })
    );

    return data;
  }
}
