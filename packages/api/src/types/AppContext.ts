import { ArcGISApi } from '../datasources/ArcGISApi';

export interface AppContext {
  dataSources: {
    ArcGISApi: ArcGISApi;
  };
}
