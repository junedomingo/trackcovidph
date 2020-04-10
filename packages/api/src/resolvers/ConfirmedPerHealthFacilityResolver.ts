import { Ctx, Query, Resolver } from 'type-graphql';
import { ConfirmedPerHealthFacility } from '../types/graphql';
import { AppContext } from '../types/interfaces';

@Resolver()
export class ConfirmedPerHealthFacilityResolver {
  @Query(() => [ConfirmedPerHealthFacility])
  async confirmedPerHealthFacility(
    @Ctx() { dataSources }: AppContext
  ): Promise<ConfirmedPerHealthFacility[]> {
    const { features } = await dataSources.ArcGISApi.getConfirmedPerHealthFacility();
    const data = features.map(
      ({ attributes: attr }): ConfirmedPerHealthFacility => ({
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
