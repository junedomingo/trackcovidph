import { ArcGISApi } from '../../datasources';

export interface AppContext {
  dataSources: {
    ArcGISApi: ArcGISApi;
  };
}
