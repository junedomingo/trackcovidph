import { Resolver, Ctx, Query } from 'type-graphql';
import { AppContext, PUIPerHealthFacilityResponse } from '../types';

@Resolver()
export class PUIsByHealthFacilityResolver {
  @Query(() => [PUIPerHealthFacilityResponse])
  async puisByHealthFacility(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getPUIsByHealthFacility();
    const data = features.map(
      ({ attributes: attr }): PUIPerHealthFacilityResponse => ({
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
