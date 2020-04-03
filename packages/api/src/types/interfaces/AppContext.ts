import { ArcGISApi } from '../../datasources';
import { RedisCache } from 'apollo-server-cache-redis';

export interface AppContext {
  dataSources: {
    ArcGISApi: ArcGISApi;
  };
  redis: RedisCache;
}
