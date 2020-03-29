import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types';
import { ConfirmedByResidenceResponse } from '../types/ConfirmedByResidenceResponse';

@Resolver()
export class ConfirmedByResidenceResolver {
  @Query(() => [ConfirmedByResidenceResponse])
  async confirmedByResidence(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getConfirmedByResidence();
    const data = features.map(
      ({ attributes: attr }): ConfirmedByResidenceResponse => ({
        count: attr.value,
        residence: attr.residence,
      })
    );

    return data;
  }
}
