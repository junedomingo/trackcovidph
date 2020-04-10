import { Resolver, Ctx, Query } from 'type-graphql';

import { PUIPerHealthFacility } from '../types/graphql';
import { AppContext } from '../types/interfaces';

@Resolver()
export class PUIsByHealthFacilityResolver {
  @Query(() => [PUIPerHealthFacility])
  async puisPerHealthFacility(@Ctx() { dataSources }: AppContext): Promise<PUIPerHealthFacility[]> {
    const { features } = await dataSources.ArcGISApi.getPUIsPerHealthFacility();
    const data = features.map(
      ({ attributes: attr }): PUIPerHealthFacility => ({
        region: attr.region,
        facility: attr.hf,
        count: attr.PUIs,
        coordinates: {
          lat: attr.latitude,
          lng: attr.longitude,
        },
      })
    );

    return data;
  }
}
