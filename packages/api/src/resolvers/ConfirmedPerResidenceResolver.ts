import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types/interfaces';
import { ConfirmedPerResidence } from '../types/graphql';

@Resolver()
export class ConfirmedPerResidenceResolver {
  @Query(() => [ConfirmedPerResidence])
  async confirmedPerResidence(
    @Ctx() { dataSources }: AppContext
  ): Promise<ConfirmedPerResidence[]> {
    const { features } = await dataSources.ArcGISApi.getConfirmedPerResidence();
    const data = features.map(
      ({ attributes: attr }): ConfirmedPerResidence => ({
        count: attr.value,
        residence: attr.residence,
      })
    );

    return data;
  }
}
