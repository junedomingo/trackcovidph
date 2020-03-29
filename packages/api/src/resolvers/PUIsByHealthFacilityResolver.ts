import { Resolver, Ctx, Query } from 'type-graphql';
import { AppContext, PUIByHealthFacilityResponse } from '../types';

@Resolver()
export class PUIsByHealthFacilityResolver {
  @Query(() => [PUIByHealthFacilityResponse])
  async puisByHealthFacility(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getPUIsByHealthFacility();
    const data = features.map(
      ({ attributes: attr }): PUIByHealthFacilityResponse => ({
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
