interface Field {
  name: string;
  type: string;
  alias: string;
  sqlType: string;
  domain?: string;
  defaultValue?: string;
}

export interface ArcGISResponse<T> {
  objectIdFieldName: string;
  uniqueIdField: {
    name: string;
    isSystemMaintained: boolean;
  };
  globalIdFieldName: string;
  geometryType: string;
  spatialReference: {
    wkid: number;
    latestWkid: number;
  };
  fields: [Field];
  exceededTransferLimit?: boolean;
  features: [T];
}
