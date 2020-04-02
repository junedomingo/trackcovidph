import { Ctx, Query, Resolver } from 'type-graphql';

import { AppContext } from '../types/interfaces';
import { CountResponse } from '../types/graphql';

@Resolver()
export class CountResolver {
  @Query(() => CountResponse)
  async count(@Ctx() { dataSources }: AppContext) {
    const { features } = await dataSources.ArcGISApi.getCount();
    const data = features.map(
      ({ attributes: attr }): CountResponse => ({
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
