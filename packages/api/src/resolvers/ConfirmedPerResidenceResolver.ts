import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types';
import { ConfirmedPerResidenceResponse } from '../types';

@Resolver()
export class ConfirmedPerResidenceResolver {
  @Query(() => [ConfirmedPerResidenceResponse])
  async confirmedPerResidence(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedPerResidence();
    const data = features.map(
      ({ attributes: attr }): ConfirmedPerResidenceResponse => ({
        count: attr.value,
        residence: attr.residence,
      })
    );

    return data;
  }
}
