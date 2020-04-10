import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types/interfaces';
import { Counts } from '../types/graphql';

@Resolver()
export class CountResolver {
  @Query(() => Counts)
  async counts(@Ctx() { dataSources }: AppContext): Promise<Counts> {
    const { features } = await dataSources.ArcGISApi.getCounts();
    const data = features.map(
      ({ attributes: attr }): Counts => ({
        day: attr.day,
        confirmed: attr.confirmed,
        PUIs: attr.PUIs,
        PUMs: attr.PUMs,
        recovered: attr.recovered,
        deaths: attr.deaths,
        tests: attr.tests,
      })
    );

    return data[0];
  }
}
