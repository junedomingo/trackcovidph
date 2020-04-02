import { Ctx, Query, Resolver } from 'type-graphql';
import { ConfirmedPerHealthFacilityResponse } from '../types/graphql';
import { AppContext } from '../types/interfaces';

@Resolver()
export class ConfirmedPerHealthFacilityResolver {
  @Query(() => [ConfirmedPerHealthFacilityResponse])
  async confirmedPerHealthFacility(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedPerHealthFacility();
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
