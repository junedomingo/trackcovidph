import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types';
import { ConfirmedByHealthFacilityResponse } from '../types/ConfirmedByHealthFacilityResponse';

@Resolver()
export class ConfirmedByHealthFacilityResolver {
  @Query(() => [ConfirmedByHealthFacilityResponse])
  async confirmedByHealthFacility(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedByHealthFacility();
    const data = features.map(
      ({ attributes: attr }): ConfirmedByHealthFacilityResponse => ({
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
